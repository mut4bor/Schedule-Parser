import * as style from './style.module.scss'
import { Skeleton } from '@/shared/ui'
import { UpdateLessonDTO } from '@/shared/redux/types'
import {
  useUpdateLessonInDayMutation,
  useDeleteLessonFromDayMutation,
  useCreateLessonInDayMutation,
  useGetWeekScheduleByIDQuery,
} from '@/shared/redux/slices/api/groupsApi'
import { useGetAllTeachersQuery } from '@/shared/redux/slices/api/teachersApi'
import { useAppSelector } from '@/shared/redux/hooks'
import { AddItem } from '@/widgets/add-item'
import { LessonListItem } from './LessonListItem'
import { Modal } from '../modal'
import { ModalForm } from '../modal-form'
import { ModalInput } from '../modal-input'
import { useState } from 'react'
import { ModalSelect } from '../modal-select'

interface Props {
  groupID: string
  pickedDayIndex: number
  pickedWeek: string | null
}

export const Schedule = ({ groupID, pickedDayIndex, pickedWeek }: Props) => {
  const accessToken = useAppSelector((store) => store.auth.accessToken)

  const { data: scheduleData } = useGetWeekScheduleByIDQuery(
    {
      groupID: groupID,
      week: pickedWeek ?? '',
    },
    {
      skip: !pickedWeek,
    },
  )

  const { data: teachers } = useGetAllTeachersQuery()

  const [createLesson] = useCreateLessonInDayMutation()
  const [updateLesson] = useUpdateLessonInDayMutation()
  const [deleteLesson] = useDeleteLessonFromDayMutation()

  const isScheduleData = !!scheduleData && pickedDayIndex !== -1 && !!scheduleData[pickedDayIndex]

  const handleCreateLesson = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const formData = new FormData(e.target as HTMLFormElement)
    const time = formData.get('time') as string
    const classroom = formData.get('classroom') as string
    const teacherID = formData.get('teacherID') as string
    const lessonType = formData.get('lessonType') as string
    const subject = formData.get('subject') as string

    if (!groupID || !pickedWeek || pickedDayIndex === -1) return

    try {
      await createLesson({
        id: groupID,
        weekName: pickedWeek,
        dayIndex: pickedDayIndex,
        time,
        classroom,
        teacherID,
        subject,
        lessonType,
      }).unwrap()
    } catch (err) {
      console.error('Ошибка при создании урока:', err)
    }
  }

  const handleUpdateLesson = async (
    lessonId: string,
    newLesson: Omit<UpdateLessonDTO, 'id' | 'weekName' | 'dayIndex' | 'lessonId'>,
  ) => {
    if (!scheduleData || !pickedWeek || pickedDayIndex === -1) return
    try {
      const oldLesson = scheduleData[pickedDayIndex].find((lesson) => lesson._id === lessonId)

      if (!oldLesson) return

      await updateLesson({
        id: groupID,
        weekName: pickedWeek,
        dayIndex: pickedDayIndex,
        lessonId,
        ...oldLesson,
        ...newLesson,
      }).unwrap()
    } catch (err) {
      console.error('Ошибка при обновлении урока:', err)
    }
  }

  const handleDeleteLesson = async (lessonId: string) => {
    if (!groupID || !pickedWeek || pickedDayIndex === -1) return
    try {
      await deleteLesson({
        id: groupID,
        weekName: pickedWeek,
        dayIndex: pickedDayIndex,
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
        <AddItem addButtonLabel="Добавить пару" isAdding={isModalOpen} setIsAdding={setIsModalOpen}>
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
  )
}
