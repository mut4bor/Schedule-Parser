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
import { AdminAddButton } from '@/entities/admin'
import { LessonListItem } from './LessonListItem'
import { Modal } from '@/widgets/modal'
import { ModalForm } from '@/widgets/modal-form'
import { ModalInput } from '@/widgets/modal-input'
import { useState } from 'react'
import { ModalSelect } from '@/widgets/modal-select'
import { RefreshDate } from '@/widgets/refresh-date'
import { DayOfWeek, TimeSlots } from '@/shared/redux/types'
import { PickedWeekType } from '@/pages/groupID'
import { useGetAllClassroomsQuery } from '@/shared/redux/slices/api/classroomsApi'

interface Props {
  groupID: string
  pickedDayIndex: number
  pickedWeek: PickedWeekType | null
}

export const Schedule = ({ groupID, pickedDayIndex, pickedWeek }: Props) => {
  const accessToken = useAppSelector((store) => store.auth.accessToken)

  const { data: scheduleData } = useGetScheduleByIdQuery(
    { id: pickedWeek?.id ?? '' },
    { skip: !pickedWeek?.id },
  )

  const { data: teachersData } = useGetAllTeachersQuery()
  const { data: classroomsData } = useGetAllClassroomsQuery()

  const [createLesson] = useCreateLessonMutation()
  const [updateLesson] = useUpdateLessonMutation()
  const [deleteLesson] = useDeleteLessonMutation()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const handleCancel = () => setIsModalOpen(false)

  const [formState, setFormState] = useState({
    time: '',
    subject: '',
    teacherID: '',
    lessonType: '',
    classroomID: '',
  })

  const handleChange = (field: keyof typeof formState, value: string) => {
    setFormState((prev) => ({ ...prev, [field]: value }))
  }

  const handleCreateLesson = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const { time, subject, teacherID, classroomID, lessonType } = formState

    console.log('formState', {
      id: groupID,
      weekName: pickedWeek?.name,
      dayIndex: pickedDayIndex,
      time,
      classroomID,
      teacherID,
      subject,
      lessonType,
    })

    if (!groupID || !pickedWeek || pickedDayIndex === -1) return

    if (!isValidLessonType(lessonType)) {
      console.error('Недопустимый тип занятия:', lessonType)
      return
    }

    try {
      await createLesson({
        id: groupID,
        weekName: pickedWeek.name,
        dayIndex: pickedDayIndex,
        time,
        classroomID,
        teacherID,
        subject,
        lessonType,
      }).unwrap()

      setFormState({
        time: '',
        subject: '',
        teacherID: '',
        lessonType: '',
        classroomID: '',
      })

      setIsModalOpen(false)
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
    if (!window.confirm('Вы уверены, что хотите удалить эту пару?')) return

    try {
      await deleteLesson(args).unwrap()
    } catch (err) {
      console.error('Ошибка при удалении урока:', err)
    }
  }

  const selectedDay = scheduleData?.days.find((day) => day.dayOfWeek === pickedDayIndex)

  const usedTimes = selectedDay?.lessons.map((lesson) => lesson.time) ?? []

  const availableTimeSlots = TimeSlots.filter((time) => !usedTimes.includes(time))

  return (
    <>
      <ul className={style.lessonList}>
        {!scheduleData || !pickedWeek || pickedDayIndex === DayOfWeek.None
          ? Array.from({ length: 5 }).map((_, index) => (
              <li key={index}>
                <Skeleton className={style.skeleton} />
              </li>
            ))
          : selectedDay?.lessons.map((lesson, index) => (
              <LessonListItem
                key={index}
                lesson={lesson}
                scheduleID={scheduleData._id}
                dayIndex={pickedDayIndex}
                lessonIndex={index}
                onUpdate={handleUpdateLesson}
                onDelete={handleDeleteLesson}
              />
            ))}

        {accessToken && !!availableTimeSlots.length && scheduleData && pickedWeek?.id && (
          <AdminAddButton onClick={() => setIsModalOpen(true)}>Добавить пару</AdminAddButton>
        )}
      </ul>

      <RefreshDate date={scheduleData?.updatedAt} />

      {isModalOpen && teachersData && classroomsData && (
        <Modal onClose={handleCancel}>
          <ModalForm onSubmit={handleCreateLesson} onCancel={handleCancel}>
            <ModalSelect
              label="Время:"
              name="time"
              value={formState.time}
              onChange={(e) => handleChange('time', e.target.value)}
              options={availableTimeSlots.map((time) => ({
                value: time,
                label: time,
              }))}
            />

            <ModalInput
              label="Название предмета:"
              name="subject"
              value={formState.subject}
              onChange={(e) => handleChange('subject', e.target.value)}
            />

            <ModalSelect
              label="Преподаватель:"
              name="teacherID"
              value={formState.teacherID}
              onChange={(e) => handleChange('teacherID', e.target.value)}
              options={teachersData.map((teacher) => ({
                value: teacher._id,
                label: `${teacher.firstName} ${teacher.middleName} ${teacher.lastName}`,
              }))}
            />

            <ModalSelect
              label="Тип занятия:"
              name="lessonType"
              value={formState.lessonType}
              onChange={(e) => handleChange('lessonType', e.target.value)}
              options={Object.values(LessonType).map((value) => ({
                value,
                label: value,
              }))}
            />

            <ModalSelect
              label="Аудитория:"
              name="classroomID"
              value={formState.classroomID}
              onChange={(e) => handleChange('classroomID', e.target.value)}
              options={classroomsData.map((classroom) => ({
                value: classroom._id,
                label: `${classroom.name} (до ${classroom.capacity} человек)`,
              }))}
            />
          </ModalForm>
        </Modal>
      )}
    </>
  )
}
