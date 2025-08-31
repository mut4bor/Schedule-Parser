import { Link, useParams } from 'react-router-dom'
import * as style from './style.module.scss'
import { useState } from 'react'
import { InlineEdit, EditDeleteActions } from '@/entities/admin'

type CrudHandlers = {
  onUpdateCourse?: (oldCourse: string, newCourse: string) => Promise<void>
  onDeleteCourse?: (course: string) => Promise<void>
}

type Props = {
  course: string
  crudHandlers?: CrudHandlers
}

export const CourseButton = ({ course, crudHandlers }: Props) => {
  const { educationType, faculty, course: pickedCourse } = useParams()
  const [isEditing, setIsEditing] = useState(false)

  const handleSave = async (newValue: string) => {
    if (!crudHandlers?.onUpdateCourse) return
    try {
      await crudHandlers.onUpdateCourse(course, newValue)
      setIsEditing(false)
    } catch (err) {
      console.error('Ошибка при обновлении курса:', err)
    }
  }

  const handleDelete = async () => {
    if (!crudHandlers?.onDeleteCourse) return
    try {
      await crudHandlers.onDeleteCourse(course)
    } catch (err) {
      console.error('Ошибка при удалении курса:', err)
    }
  }

  if (isEditing) {
    return (
      <InlineEdit
        initialValue={course}
        onSave={handleSave}
        onCancel={() => setIsEditing(false)}
      />
    )
  }

  return (
    <div className={style.container}>
      <Link
        to={`/educationTypes/${educationType}/faculties/${faculty}/courses/${course}`}
        className={`${style.button} ${
          pickedCourse === course ? style.active : ''
        }`}
      >
        {course}
      </Link>
      {crudHandlers && (
        <EditDeleteActions
          onEdit={() => setIsEditing(true)}
          onDelete={handleDelete}
        />
      )}
    </div>
  )
}
