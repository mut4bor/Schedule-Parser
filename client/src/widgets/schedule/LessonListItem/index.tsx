import * as style from './style.module.scss'
import { useState } from 'react'
import { DayOfWeek, ILesson, TimeSlots } from '@/shared/redux/types'
import { useAppSelector } from '@/shared/redux/hooks'
import {
  UpdateLessonDTO,
  DeleteLessonDTO,
  LessonType,
  isValidLessonType,
} from '@/shared/redux/slices/api/scheduleApi'
import { Modal } from '@/widgets/modal'
import { ModalForm } from '@/widgets/modal-form'
import { ModalInput } from '@/widgets/modal-input'
import { ModalSelect } from '@/widgets/modal-select'
import { EditDeleteActions } from '@/entities/admin'
import { useGetAllTeachersQuery } from '@/shared/redux/slices/api/teachersApi'

interface Props {
  lesson: ILesson
  scheduleID: string
  dayIndex: DayOfWeek
  lessonIndex: number
  onUpdate: (args: UpdateLessonDTO) => Promise<void>
  onDelete: (args: DeleteLessonDTO) => Promise<void>
}

export const LessonListItem = ({
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

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)

    const lessonType = String(formData.get('lessonType'))

    const typedForm: Omit<UpdateLessonDTO, 'scheduleID' | 'dayIndex' | 'lessonIndex'> = {
      time: String(formData.get('time') || undefined),
      classroom: String(formData.get('classroom') || undefined),
      teacherID: String(formData.get('teacherID') || undefined),
      subject: String(formData.get('subject') || undefined),
      lessonType: isValidLessonType(lessonType) ? lessonType : undefined,
    }

    try {
      await onUpdate({
        scheduleID,
        dayIndex,
        lessonIndex,
        ...typedForm,
      })
    } catch (err) {
      console.error('Ошибка при создании урока:', err)
    }
  }

  const handleCancel = () => {
    setIsModalOpen(false)
  }

  console.log('lesson', lesson)

  return (
    <li className={style.lessonListItem}>
      <div className={style.lessonHeader}>
        <p className={style.text}>
          {lesson.time} - {lesson.subject}
          {` (${lesson.lessonType})`}
          {lesson.teacher?.title ? `, ${lesson.teacher.title}` : ''}
          {lesson.teacher?.lastName ? ` ${lesson.teacher.lastName}` : ''}
          {lesson.teacher?.firstName ? ` ${lesson.teacher.firstName.charAt(0).toUpperCase()}.` : ''}
          {lesson.teacher?.middleName
            ? ` ${lesson.teacher.middleName.charAt(0).toUpperCase()}.`
            : ''}
          {`, ${lesson.classroom}`}
        </p>

        {accessToken && (
          <div>
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
          </div>
        )}
      </div>

      {isModalOpen && accessToken && teachersData && (
        <Modal onClose={handleCancel}>
          <ModalForm onSubmit={handleSave} onCancel={handleCancel}>
            <ModalSelect
              label="Время:"
              name="time"
              defaultValue={lesson.time}
              options={TimeSlots.map((time) => ({
                value: time,
                label: time,
              }))}
            />
            <ModalInput label="Название предмета:" name="subject" defaultValue={lesson.subject} />
            <ModalSelect
              label="Преподаватель:"
              name="teacherID"
              defaultValue={lesson.teacher._id}
              options={teachersData.map((teacher) => ({
                value: teacher._id,
                label: `${teacher.firstName} ${teacher.middleName} ${teacher.lastName}`,
              }))}
            />
            <ModalSelect
              label="Тип занятия:"
              name="lessonType"
              defaultValue={lesson.lessonType}
              options={Object.values(LessonType).map((value) => ({
                value: value,
                label: value,
              }))}
            />
            <ModalInput label="Аудитория:" name="classroom" defaultValue={lesson.classroom} />
          </ModalForm>
        </Modal>
      )}
    </li>
  )
}
