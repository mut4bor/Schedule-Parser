import * as style from './style.module.scss'
import { DeleteLessonDTO, ILesson, UpdateLessonDTO } from '@/shared/redux/types'
import { useState } from 'react'
import { useAppSelector } from '@/shared/redux/hooks'
import { EditDeleteActions } from '@/entities/admin'
import { Modal } from '@/widgets/modal'
import { ModalInput } from '@/widgets/modal-input'
import { ModalForm } from '@/widgets/modal-form'

interface Props {
  group: {
    id: string
    name: string
  }
  weekName: string
  dayIndex: number
  lesson: ILesson
  onUpdate: (args: UpdateLessonDTO) => Promise<void>
  onDelete?: (args: DeleteLessonDTO) => Promise<void>
}

export const LessonListItemAdmin = ({
  group,
  weekName,
  dayIndex,
  lesson,
  onUpdate,
  onDelete,
}: Props) => {
  const accessToken = useAppSelector((store) => store.auth.accessToken)
  const [isModalOpen, setIsModalOpen] = useState(false)

  if (!lesson) return null

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)

    try {
      await onUpdate({
        id: group.id,
        weekName,
        dayIndex,
        lessonId: lesson._id,
        subject: formData.get('subject') as string,
        lessonType: formData.get('lessonType') as string,
        classroom: formData.get('classroom') as string,
        teacherID: formData.get('teacherID') as string,
      })
    } catch (err) {
      console.error('Ошибка при создании урока:', err)
    }

    setIsModalOpen(false)
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
          {` ${lesson.teacher.firstName.charAt(0).toUpperCase()}.`}
          {` ${lesson.teacher.middleName.charAt(0).toUpperCase()}.`}

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
                        id: group.id,
                        weekName,
                        dayIndex,
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
          <div className={style.modalContent}>
            <h2 className={style.modalTitle}>Редактирование урока</h2>

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
          </div>
        </Modal>
      )}
    </li>
  )
}
