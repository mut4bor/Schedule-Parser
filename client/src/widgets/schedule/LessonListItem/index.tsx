import { useState } from 'react'
import { EditableItem } from '@/widgets/editable-item'
import * as style from './style.module.scss'
import { ILesson } from '@/shared/redux/types'
import { useAppSelector } from '@/shared/redux/hooks'
import { UpdateLessonDTO } from '@/shared/redux/slices/api/scheduleApi'

interface Props {
  lesson: ILesson
  onDelete: (id: string) => Promise<void>
  onUpdate: ({
    lessonId,
    time,
    classroom,
    teacherID,
    subject,
    lessonType,
  }: UpdateLessonDTO) => Promise<void>
}

export const LessonListItem = ({ lesson, onDelete, onUpdate }: Props) => {
  const accessToken = useAppSelector((store) => store.auth.accessToken)
  const [isCollapsed, setIsCollapsed] = useState(true)

  return (
    <li className={style.lessonListItem}>
      <div className={style.lessonHeader}>
        <EditableItem
          value={lesson.time}
          crudHandlers={{
            onDelete: async () => onDelete(lesson._id),
          }}
        >
          <p className={style.text}>
            {lesson.time} - {lesson.subject}
            {lesson.lessonType && ` (${lesson.lessonType})`}
            {lesson.teacher.title && `, ${lesson.teacher.title}`}
            {` ${lesson.teacher.lastName}`}
            {` ${lesson.teacher.firstName.charAt(0).toUpperCase()}.`}
            {` ${lesson.teacher.middleName.charAt(0).toUpperCase()}.`}
            {`, ${lesson.classroom}`}
          </p>
        </EditableItem>

        {accessToken && (
          <button className={style.toggleBtn} onClick={() => setIsCollapsed((prev) => !prev)}>
            {isCollapsed ? '▼' : '▲'}
          </button>
        )}
      </div>

      {!isCollapsed && accessToken && (
        <ul className={style.editList}>
          {[
            {
              label: 'Время',
              value: lesson.time,
              type: 'time',
              update: (newValue: string) => onUpdate({ lessonId: lesson._id, time: newValue }),
              delete: () => onUpdate({ lessonId: lesson._id, time: '' }),
            },
            {
              label: 'Предмет',
              value: lesson.subject,
              update: (newValue: string) => onUpdate({ lessonId: lesson._id, subject: newValue }),
              delete: () => onUpdate({ lessonId: lesson._id, subject: '' }),
            },
            {
              label: 'Тип',
              value: lesson.lessonType,
              update: (newValue: string) =>
                onUpdate({ lessonId: lesson._id, lessonType: newValue }),
              delete: () => onUpdate({ lessonId: lesson._id, lessonType: '' }),
            },
            {
              label: 'Преподаватель',
              value: lesson.teacher.title ?? '',
              update: (newValue: string) =>
                onUpdate({
                  lessonId: lesson._id,
                  teacherID: newValue,
                }),
              delete: () =>
                onUpdate({
                  lessonId: lesson._id,
                  teacherID: '',
                }),
            },

            {
              label: 'Аудитория',
              value: lesson.classroom,
              update: (newValue: string) => onUpdate({ lessonId: lesson._id, classroom: newValue }),
              delete: () => onUpdate({ lessonId: lesson._id, classroom: '' }),
            },
          ].map((field, index) => (
            <li className={style.editListItem} key={index}>
              <p className={style.editLabel}>{field.label}:</p>
              <div className={style.editContainer}>
                <EditableItem
                  value={field.value}
                  type={(field?.type as 'text' | 'date' | 'week' | 'time') ?? 'text'}
                  crudHandlers={{
                    onUpdate: async (_, newValue) => field.update(newValue),
                  }}
                >
                  <p className={`${style.editValue} ${!field.value ? style.empty : ''}`}>
                    {field.value}
                  </p>
                </EditableItem>
              </div>
            </li>
          ))}
        </ul>
      )}
    </li>
  )
}
