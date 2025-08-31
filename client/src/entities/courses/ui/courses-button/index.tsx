import { Link, useParams } from 'react-router-dom'
import * as style from './style.module.scss'
import { useState } from 'react'

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
  const [editingValue, setEditingValue] = useState(course)

  const handleSave = async () => {
    if (!crudHandlers?.onUpdateCourse) return
    try {
      await crudHandlers.onUpdateCourse(course, editingValue)
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
      <div className={style.editForm}>
        <input
          type="text"
          value={editingValue}
          onChange={(e) => setEditingValue(e.target.value)}
          className={style.editInput}
        />
        <button onClick={handleSave} className={style.saveButton}>
          ✓
        </button>
        <button
          onClick={() => setIsEditing(false)}
          className={style.cancelButton}
        >
          ✕
        </button>
      </div>
    )
  }

  return (
    <div className={style.courseItem}>
      <Link
        to={`/educationTypes/${educationType}/faculties/${faculty}/courses/${course}`}
        className={`${style.button} ${
          pickedCourse === course ? style.active : ''
        }`}
      >
        {course}
      </Link>
      {crudHandlers && (
        <div className={style.courseActions}>
          <button
            onClick={() => setIsEditing(true)}
            className={style.editButton}
          >
            ✏️
          </button>
          <button onClick={handleDelete} className={style.deleteButton}>
            🗑️
          </button>
        </div>
      )}
    </div>
  )
}
