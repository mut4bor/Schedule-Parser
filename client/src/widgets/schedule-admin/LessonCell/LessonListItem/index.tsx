import * as style from './style.module.scss'
import { DayOfWeek, ILesson } from '@/shared/redux/types'
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

  if (!lesson) return null

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

  return (
    <li className={style.lessonListItem}>
      <div className={style.lessonHeader}>
        <p className={style.text}>
          {lesson.subject}
          {lesson.lessonType && ` (${lesson.lessonType})`}

          {lesson.teacher.title && `, ${lesson.teacher.title}`}
          {` ${lesson.teacher.lastName}`}
          {` ${lesson.teacher.firstName}`}
          {` ${lesson.teacher.middleName}`}

          {lesson.classroom && `, ${lesson.classroom}`}
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
            <ModalInput label="Время:" name="time" defaultValue={lesson.time} type="time" />
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
