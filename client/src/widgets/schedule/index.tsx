import * as style from './style.module.scss'
import { Skeleton } from '@/shared/ui'
import {
  UpdateLessonDTO,
  useUpdateLessonMutation,
  useDeleteLessonMutation,
  useCreateLessonMutation,
  LessonType,
} from '@/shared/redux/slices/api/scheduleApi'
import { useGetWeekScheduleByGroupIdQuery } from '@/shared/redux/slices/api/weekApi'
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

interface Props {
  groupID: string
  pickedDayIndex: number
  pickedWeek: string | null
}

const isLessonType = (value: string): value is LessonType => {
  return ['Лекция', 'Практика', 'Лабораторная', 'Семинар'].includes(value)
}

export const Schedule = ({ groupID, pickedDayIndex, pickedWeek }: Props) => {
  const accessToken = useAppSelector((store) => store.auth.accessToken)

  const { data: scheduleData } = useGetWeekScheduleByGroupIdQuery(
    {
      groupID: groupID,
      week: pickedWeek ?? '',
    },
    {
      skip: !pickedWeek,
    },
  )

  const { data: teachers } = useGetAllTeachersQuery()

  const [createLesson] = useCreateLessonMutation()
  const [updateLesson] = useUpdateLessonMutation()
  const [deleteLesson] = useDeleteLessonMutation()

  const isScheduleData = !!scheduleData && pickedDayIndex !== -1 && !!scheduleData[pickedDayIndex]

  const handleCreateLesson = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const formData = new FormData(e.target as HTMLFormElement)
    const time = formData.get('time') as string
    const classroom = formData.get('classroom') as string
    const teacherID = formData.get('teacherID') as string
    const lessonTypeRaw = formData.get('lessonType') as string
    const subject = formData.get('subject') as string

    if (!groupID || !pickedWeek || pickedDayIndex === -1) return

    // Проверяем, что lessonType соответствует типу LessonType
    if (!isLessonType(lessonTypeRaw)) {
      console.error('Недопустимый тип занятия:', lessonTypeRaw)
      return
    }

    try {
      await createLesson({
        id: groupID,
        weekName: pickedWeek,
        dayIndex: pickedDayIndex,
        time,
        classroom,
        teacherID,
        subject,
        lessonType: lessonTypeRaw, // теперь lessonTypeRaw – это точно LessonType
      }).unwrap()
    } catch (err) {
      console.error('Ошибка при создании урока:', err)
    }
  }

  const handleUpdateLesson = async ({
    lessonId,
    time,
    classroom,
    teacherID,
    subject,
    lessonType,
  }: UpdateLessonDTO) => {
    try {
      await updateLesson({
        lessonId,
        time,
        classroom,
        teacherID,
        subject,
        lessonType,
      }).unwrap()
    } catch (err) {
      console.error('Ошибка при обновлении урока:', err)
    }
  }

  const handleDeleteLesson = async (lessonId: string) => {
    try {
      await deleteLesson({
        lessonId,
      }).unwrap()
    } catch (err) {
      console.error('Ошибка при удалении урока:', err)
    }
  }

  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleCancel = () => {
    setIsModalOpen(false)
  }

  return (
    <>
      <ul className={style.lessonList}>
        {!isScheduleData || !pickedWeek
          ? Array.from({ length: 5 }).map((_, index) => (
              <li key={index}>
                <Skeleton className={style.skeleton} />
              </li>
            ))
          : [...scheduleData[pickedDayIndex]]
              .sort((lessonA, lessonB) => {
                const [hA, mA] = lessonA.time.split(':').map(Number)
                const [hB, mB] = lessonB.time.split(':').map(Number)
                return hA - hB || mA - mB
              })
              .map((lesson, index) => (
                <LessonListItem
                  lesson={lesson}
                  onUpdate={handleUpdateLesson}
                  onDelete={handleDeleteLesson}
                  key={index}
                />
              ))}

        {accessToken && isScheduleData && teachers && pickedWeek && (
          <AddItem
            addButtonLabel="Добавить пару"
            isAdding={isModalOpen}
            setIsAdding={setIsModalOpen}
          >
            <Modal onClose={handleCancel}>
              <ModalForm onSubmit={handleCreateLesson} onCancel={handleCancel}>
                <ModalInput label="Время:" name="time" defaultValue="" type="time" />
                <ModalInput label="Аудитория:" name="classroom" defaultValue="" />
                <ModalSelect
                  label="Преподаватель:"
                  name="teacherID"
                  defaultValue=""
                  options={teachers.map((teacher) => ({
                    value: teacher._id,
                    label: `${teacher.firstName} ${teacher.middleName} ${teacher.lastName}`,
                  }))}
                />
                <ModalInput label="Тип предмета:" name="lessonType" defaultValue="" />
                <ModalInput label="Название предмета:" name="subject" defaultValue="" />
              </ModalForm>
            </Modal>
          </AddItem>
        )}
      </ul>

      <RefreshDate date={scheduleData?.updatedAt} />
    </>
  )
}
