import * as style from './style.module.scss'
import { Skeleton } from '@/shared/ui'
import {
  UpdateLessonDTO,
  useUpdateLessonMutation,
  useDeleteLessonMutation,
  useCreateLessonMutation,
  DeleteLessonDTO,
  isValidLessonType,
  LessonType,
} from '@/shared/redux/slices/api/scheduleApi'
import { useGetScheduleByIdQuery } from '@/shared/redux/slices/api/scheduleApi'
import { useGetAllTeachersQuery } from '@/shared/redux/slices/api/teachersApi'
import { useAppSelector } from '@/shared/redux/hooks'
import { AddItem } from '@/widgets/add-item'
import { LessonListItem } from './LessonListItem'
import { Modal } from '../modal'
import { ModalForm } from '../modal-form'
import { ModalInput } from '../modal-input'
import { useState } from 'react'
import { ModalSelect } from '../modal-select'
import { RefreshDate } from '../refresh-date'
import { DayOfWeek } from '@/shared/redux/types'
import { PickedWeekType } from '@/pages/groupID'

interface Props {
  groupID: string
  pickedDayIndex: number
  pickedWeek: PickedWeekType | null
}

export const Schedule = ({ groupID, pickedDayIndex, pickedWeek }: Props) => {
  const accessToken = useAppSelector((store) => store.auth.accessToken)

  const { data: scheduleData } = useGetScheduleByIdQuery(
    {
      id: pickedWeek?.id ?? '',
    },
    {
      skip: !pickedWeek?.id,
    },
  )

  const { data: teachersData } = useGetAllTeachersQuery()

  const [createLesson] = useCreateLessonMutation()
  const [updateLesson] = useUpdateLessonMutation()
  const [deleteLesson] = useDeleteLessonMutation()

  const handleCreateLesson = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const formData = new FormData(e.target as HTMLFormElement)
    const time = formData.get('time') as string
    const classroom = formData.get('classroom') as string
    const teacherID = formData.get('teacherID') as string
    const lessonTypeRaw = formData.get('lessonType') as string
    const subject = formData.get('subject') as string

    if (!groupID || !pickedWeek || pickedDayIndex === -1) return

    if (!isValidLessonType(lessonTypeRaw)) {
      console.error('Недопустимый тип занятия:', lessonTypeRaw)
      return
    }

    try {
      await createLesson({
        id: groupID,
        weekName: pickedWeek.name,
        dayIndex: pickedDayIndex,
        time,
        classroom,
        teacherID,
        subject,
        lessonType: lessonTypeRaw,
      }).unwrap()
    } catch (err) {
      console.error('Ошибка при создании урока:', err)
    }
  }

  const handleUpdateLesson = async (args: UpdateLessonDTO) => {
    try {
      await updateLesson(args).unwrap()
    } catch (err) {
      console.error('Ошибка при обновлении урока:', err)
    }
  }

  const handleDeleteLesson = async (args: DeleteLessonDTO) => {
    if (!window.confirm(`Вы уверены, что хотите удалить эту пару?`)) return

    try {
      await deleteLesson(args).unwrap()
    } catch (err) {
      console.error('Ошибка при удалении урока:', err)
    }
  }

  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleCancel = () => {
    setIsModalOpen(false)
  }

  console.log('scheduleData', scheduleData)

  return (
    <>
      <ul className={style.lessonList}>
        {!scheduleData || !pickedWeek || pickedDayIndex === DayOfWeek.None
          ? Array.from({ length: 5 }).map((_, index) => (
              <li key={index}>
                <Skeleton className={style.skeleton} />
              </li>
            ))
          : scheduleData?.days
              .find((day) => day.dayOfWeek === pickedDayIndex)
              ?.lessons.map((lesson, index) => (
                <LessonListItem
                  lesson={lesson}
                  scheduleID={scheduleData._id}
                  dayIndex={pickedDayIndex}
                  lessonIndex={index}
                  onUpdate={handleUpdateLesson}
                  onDelete={handleDeleteLesson}
                  key={index}
                />
              ))}

        {accessToken && scheduleData && teachersData && pickedWeek?.id && (
          <AddItem
            addButtonLabel="Добавить пару"
            isAdding={isModalOpen}
            setIsAdding={setIsModalOpen}
          >
            <Modal onClose={handleCancel}>
              <ModalForm onSubmit={handleCreateLesson} onCancel={handleCancel}>
                <ModalInput label="Время:" name="time" defaultValue="" type="time" />
                <ModalInput label="Название предмета:" name="subject" defaultValue="" />
                <ModalSelect
                  label="Преподаватель:"
                  name="teacherID"
                  defaultValue=""
                  options={teachersData.map((teacher) => ({
                    value: teacher._id,
                    label: `${teacher.firstName} ${teacher.middleName} ${teacher.lastName}`,
                  }))}
                />
                <ModalSelect
                  label="Тип занятия:"
                  name="lessonType"
                  defaultValue=""
                  options={Object.values(LessonType).map((value) => ({
                    value: value,
                    label: value,
                  }))}
                />
                <ModalInput label="Аудитория:" name="classroom" defaultValue="" />
              </ModalForm>
            </Modal>
          </AddItem>
        )}
      </ul>

      <RefreshDate date={scheduleData?.updatedAt} />
    </>
  )
}
