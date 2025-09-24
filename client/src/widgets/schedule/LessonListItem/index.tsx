import { useState } from 'react'
import { EditableItem } from '@/widgets/editable-item'
import * as style from './style.module.scss'
import { ILesson } from '@/shared/redux/types'

interface Props {
  lesson: ILesson
  onDelete: (id: string) => Promise<void>
  onUpdate: (id: string, newLesson: Partial<ILesson>) => Promise<void>
}

export const LessonListItem = ({ lesson, onDelete, onUpdate }: Props) => {
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
            {(lesson.teacher.title ||
              lesson.teacher.lastName ||
              lesson.teacher.firstName ||
              lesson.teacher.middleName) && (
              <>
                {lesson.teacher.title && `, ${lesson.teacher.title}`}
                {lesson.teacher.lastName && ` ${lesson.teacher.lastName}`}
                {lesson.teacher.firstName &&
                  ` ${lesson.teacher.firstName.charAt(0).toUpperCase()}.`}
                {lesson.teacher.middleName &&
                  ` ${lesson.teacher.middleName.charAt(0).toUpperCase()}.`}
              </>
            )}
            {lesson.classroom && `, ${lesson.classroom}`}
          </p>
        </EditableItem>

        <button
          className={style.toggleBtn}
          onClick={() => setIsCollapsed((prev) => !prev)}
        >
          {isCollapsed ? '▼' : '▲'}
        </button>
      </div>

      {!isCollapsed && (
        <ul className={style.editList}>
          {[
            {
              label: 'Время',
              value: lesson.time,
              type: 'time',
              update: (newValue: string) =>
                onUpdate(lesson._id, { time: newValue }),
              delete: () => onUpdate(lesson._id, { time: '' }),
            },
            {
              label: 'Предмет',
              value: lesson.subject,
              update: (newValue: string) =>
                onUpdate(lesson._id, { subject: newValue }),
              delete: () => onUpdate(lesson._id, { subject: '' }),
            },
            {
              label: 'Тип',
              value: lesson.lessonType,
              update: (newValue: string) =>
                onUpdate(lesson._id, {
                  lessonType: newValue,
                }),
              delete: () => onUpdate(lesson._id, { lessonType: '' }),
            },
            {
              label: 'Титул преподавателя',
              value: lesson.teacher.title ?? '',
              update: (newValue: string) =>
                onUpdate(lesson._id, {
                  teacher: { ...lesson.teacher, title: newValue },
                }),
              delete: () =>
                onUpdate(lesson._id, {
                  teacher: { ...lesson.teacher, title: '' },
                }),
            },
            {
              label: 'Фамилия преподавателя',
              value: lesson.teacher.lastName,
              update: (newValue: string) =>
                onUpdate(lesson._id, {
                  teacher: { ...lesson.teacher, lastName: newValue },
                }),
              delete: () =>
                onUpdate(lesson._id, {
                  teacher: { ...lesson.teacher, lastName: '' },
                }),
            },
            {
              label: 'Имя преподавателя',
              value: lesson.teacher.firstName,
              update: (newValue: string) =>
                onUpdate(lesson._id, {
                  teacher: { ...lesson.teacher, firstName: newValue },
                }),
              delete: () =>
                onUpdate(lesson._id, {
                  teacher: { ...lesson.teacher, firstName: '' },
                }),
            },
            {
              label: 'Отчество преподавателя',
              value: lesson.teacher.middleName,
              update: (newValue: string) =>
                onUpdate(lesson._id, {
                  teacher: {
                    ...lesson.teacher,
                    middleName: newValue,
                  },
                }),
              delete: () =>
                onUpdate(lesson._id, {
                  teacher: { ...lesson.teacher, middleName: '' },
                }),
            },
            {
              label: 'Аудитория',
              value: lesson.classroom,
              update: (newValue: string) =>
                onUpdate(lesson._id, {
                  classroom: newValue,
                }),
              delete: () => onUpdate(lesson._id, { classroom: '' }),
            },
          ].map((field, index) => (
            <li className={style.editListItem} key={index}>
              <p className={style.editLabel}>{field.label}:</p>
              <div className={style.editContainer}>
                <EditableItem
                  value={field.value}
                  type={
                    (field?.type as 'text' | 'date' | 'week' | 'time') ?? 'text'
                  }
                  crudHandlers={{
                    onUpdate: async (_, newValue) => field.update(newValue),
                    // onDelete: async () => field.delete(),
                  }}
                >
                  <p
                    className={`${style.editValue} ${!field.value ? style.empty : ''}`}
                  >
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
