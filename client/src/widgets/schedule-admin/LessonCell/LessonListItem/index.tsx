import { useState } from 'react'
import * as style from './style.module.scss'
import { ILesson } from '@/shared/redux/types'
import { useAppSelector } from '@/shared/redux'

const Modal = ({ children, onClose }: { children: React.ReactNode; onClose: () => void }) => {
  return (
    <div className={style.modalBackdrop} onClick={onClose}>
      <div className={style.modalContent} onClick={(e) => e.stopPropagation()}>
        <button className={style.modalCloseBtn} onClick={onClose}>
          ✖
        </button>
        {children}
      </div>
    </div>
  )
}

interface Props {
  lesson: ILesson | undefined
  onUpdate: (id: string, newLesson: Partial<ILesson>) => Promise<void>
}

export const LessonListItemAdmin = ({ lesson, onUpdate }: Props) => {
  const accessToken = useAppSelector((store) => store.auth.accessToken)
  const [isModalOpen, setIsModalOpen] = useState(false)

  if (!lesson) return null

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const updatedLesson: Partial<ILesson> = {
      time: lesson.time,
      subject: formData.get('subject') as string,
      lessonType: formData.get('lessonType') as string,
      classroom: formData.get('classroom') as string,
      teacher: {
        title: formData.get('teacherTitle') as string,
        lastName: formData.get('teacherLastName') as string,
        firstName: formData.get('teacherFirstName') as string,
        middleName: formData.get('teacherMiddleName') as string,
      },
    }
    await onUpdate(lesson._id, updatedLesson)
    setIsModalOpen(false)
  }

  return (
    <li className={style.lessonListItem}>
      <div className={style.lessonHeader}>
        <p className={style.text}>
          {lesson.subject}
          {lesson.lessonType && ` (${lesson.lessonType})`}
          {(lesson.teacher.title ||
            lesson.teacher.lastName ||
            lesson.teacher.firstName ||
            lesson.teacher.middleName) && (
            <>
              {lesson.teacher.title && `, ${lesson.teacher.title}`}
              {lesson.teacher.lastName && ` ${lesson.teacher.lastName}`}
              {lesson.teacher.firstName && ` ${lesson.teacher.firstName.charAt(0).toUpperCase()}.`}
              {lesson.teacher.middleName &&
                ` ${lesson.teacher.middleName.charAt(0).toUpperCase()}.`}
            </>
          )}
          {lesson.classroom && `, ${lesson.classroom}`}
        </p>

        {accessToken && (
          <button className={style.toggleBtn} onClick={() => setIsModalOpen(true)}>
            ✏️
          </button>
        )}
      </div>

      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <h2 className={style.modalTitle}>Редактирование урока</h2>
          <form className={style.editForm} onSubmit={handleSave}>
            <label className={style.editLabel}>
              Предмет:
              <input name="subject" className={style.editInput} defaultValue={lesson.subject} />
            </label>
            <label className={style.editLabel}>
              Тип:
              <input
                name="lessonType"
                className={style.editInput}
                defaultValue={lesson.lessonType ?? ''}
              />
            </label>
            <label className={style.editLabel}>
              Титул преподавателя:
              <input
                name="teacherTitle"
                className={style.editInput}
                defaultValue={lesson.teacher.title ?? ''}
              />
            </label>
            <label className={style.editLabel}>
              Фамилия преподавателя:
              <input
                name="teacherLastName"
                className={style.editInput}
                defaultValue={lesson.teacher.lastName ?? ''}
              />
            </label>
            <label className={style.editLabel}>
              Имя преподавателя:
              <input
                name="teacherFirstName"
                className={style.editInput}
                defaultValue={lesson.teacher.firstName ?? ''}
              />
            </label>
            <label className={style.editLabel}>
              Отчество преподавателя:
              <input
                name="teacherMiddleName"
                className={style.editInput}
                defaultValue={lesson.teacher.middleName ?? ''}
              />
            </label>
            <label className={style.editLabel}>
              Аудитория:
              <input
                name="classroom"
                className={style.editInput}
                defaultValue={lesson.classroom ?? ''}
              />
            </label>

            <div className={style.formButtons}>
              <button type="submit" className={style.submitButton}>
                Сохранить
              </button>

              <button
                type="button"
                className={style.cancelButton}
                onClick={() => setIsModalOpen(false)}
              >
                Отмена
              </button>
            </div>
          </form>
        </Modal>
      )}
    </li>
  )
}
