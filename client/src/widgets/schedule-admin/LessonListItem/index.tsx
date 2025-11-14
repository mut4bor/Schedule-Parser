import * as style from './style.module.scss'
import { DayOfWeek, ILesson, TimeSlots } from '@/shared/redux/types'
import { useState } from 'react'
import { useAppSelector } from '@/shared/redux/hooks'
import { EditDeleteActions } from '@/entities/admin'
import { Modal } from '@/widgets/modal'
import { ModalInput } from '@/widgets/modal-input'
import { ModalForm } from '@/widgets/modal-form'
import {
  UpdateLessonDTO,
  DeleteLessonDTO,
  isValidLessonType,
  LessonType,
} from '@/shared/redux/slices/api/scheduleApi'
import { ModalSelect } from '@/widgets/modal-select'
import { useGetAllTeachersQuery } from '@/shared/redux/slices/api/teachersApi'
import { useGetAllClassroomsQuery } from '@/shared/redux/slices/api/classroomsApi'

interface Props {
  lesson: ILesson
  scheduleID: string
  dayIndex: DayOfWeek
  lessonIndex: number
  onUpdate: (args: UpdateLessonDTO) => Promise<void>
  onDelete?: (args: DeleteLessonDTO) => Promise<void>
}

export const LessonListItemAdmin = ({
  lesson,
  scheduleID,
  dayIndex,
  lessonIndex,
  onUpdate,
  onDelete,
}: Props) => {
  const accessToken = useAppSelector((store) => store.auth.accessToken)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const { data: teachersData } = useGetAllTeachersQuery()
  const { data: classroomsData } = useGetAllClassroomsQuery()

  const [formState, setFormState] = useState({
    time: lesson.time || '',
    subject: lesson.subject || '',
    teacherID: lesson.teacher?._id || '',
    lessonType: lesson.lessonType || '',
    classroomID: lesson.classroom._id || '',
  })

  const handleChange = (field: keyof typeof formState, value: string) => {
    setFormState((prev) => ({ ...prev, [field]: value }))
  }

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const { time, subject, teacherID, classroomID, lessonType } = formState

    const typedForm: Omit<UpdateLessonDTO, 'scheduleID' | 'dayIndex' | 'lessonIndex'> = {
      time,
      classroomID,
      teacherID,
      subject,
      lessonType: isValidLessonType(lessonType) ? lessonType : undefined,
    }

    try {
      await onUpdate({
        scheduleID,
        dayIndex,
        lessonIndex,
        ...typedForm,
      })
      setIsModalOpen(false)
    } catch (err) {
      console.error('Ошибка при обновлении урока:', err)
    }
  }

  const handleCancel = () => setIsModalOpen(false)

  return (
    <li className={style.lessonListItem}>
      <div className={style.lessonHeader}>
        <p className={style.text}>
          {lesson.subject}
          {lesson.lessonType && ` (${lesson.lessonType})`}
          {lesson.teacher?.title && `, ${lesson.teacher.title}`}
          {lesson.teacher?.lastName && ` ${lesson.teacher.lastName}`}
          {lesson.teacher?.firstName && ` ${lesson.teacher.firstName.charAt(0).toUpperCase()}.`}
          {lesson.teacher?.middleName && ` ${lesson.teacher.middleName.charAt(0).toUpperCase()}.`}
          {lesson.classroom && `, ${lesson.classroom}`}
        </p>

        {accessToken && (
          <EditDeleteActions
            onEdit={() => setIsModalOpen(true)}
            onDelete={
              !!onDelete
                ? () =>
                    onDelete({
                      scheduleID,
                      dayIndex,
                      lessonIndex,
                    })
                : null
            }
          />
        )}
      </div>

      {isModalOpen && accessToken && teachersData && classroomsData && (
        <Modal onClose={handleCancel}>
          <ModalForm onSubmit={handleSave} onCancel={handleCancel}>
            <ModalSelect
              label="Время:"
              name="time"
              value={formState.time}
              onChange={(e) => handleChange('time', e.target.value)}
              options={TimeSlots.map((time) => ({
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
    </li>
  )
}
