import * as style from './style.module.scss'
import { ILesson } from '@/shared/redux/types'
import { useState } from 'react'
import { useAppSelector } from '@/shared/redux/hooks'
import { EditDeleteActions } from '@/entities/admin'
import { Modal } from '@/widgets/modal'
import { ModalInput } from '@/widgets/modal-input'
import { ModalForm } from '@/widgets/modal-form'
import { UpdateLessonDTO, DeleteLessonDTO } from '@/shared/redux/slices/api/scheduleApi'

interface Props {
  group: {
    id: string
    name: string
  }
  lesson: ILesson
  onUpdate: (args: UpdateLessonDTO) => Promise<void>
  onDelete?: (args: DeleteLessonDTO) => Promise<void>
}

export const LessonListItemAdmin = ({ group, lesson, onUpdate, onDelete }: Props) => {
  const accessToken = useAppSelector((store) => store.auth.accessToken)
  const [isModalOpen, setIsModalOpen] = useState(false)

  if (!lesson) return null

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)

    const typedForm: Omit<UpdateLessonDTO, 'lessonId'> = {
      time: String(formData.get('time') || undefined),
      classroom: String(formData.get('classroom') || undefined),
      teacherID: String(formData.get('teacherID') || undefined),
      subject: String(formData.get('subject') || undefined),
      lessonType: String(formData.get('lessonType') || undefined),
    }

    try {
      await onUpdate({
        lessonId: group.id,
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
                        lessonId: lesson._id,
                      })
                  : null
              }
            />
          </div>
        )}
      </div>

      {isModalOpen && (
        <Modal onClose={handleCancel}>
          <ModalForm onSubmit={handleSave} onCancel={handleCancel}>
            <ModalInput label="Предмет:" name="subject" defaultValue={lesson.subject} />
            <ModalInput label="Тип:" name="lessonType" defaultValue={lesson.lessonType} />
            <ModalInput
              label="Титул преподавателя:"
              name="teacherTitle"
              defaultValue={lesson.teacher.title ?? ''}
            />
            <ModalInput
              label="Фамилия преподавателя:"
              name="teacherLastName"
              defaultValue={lesson.teacher.lastName}
            />
            <ModalInput
              label="Имя преподавателя:"
              name="teacherFirstName"
              defaultValue={lesson.teacher.firstName}
            />
            <ModalInput
              label="Отчество преподавателя:"
              name="teacherMiddleName"
              defaultValue={lesson.teacher.middleName}
            />
            <ModalInput label="Аудитория:" name="classroom" defaultValue={lesson.classroom} />
          </ModalForm>
        </Modal>
      )}
    </li>
  )
}
