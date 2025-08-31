import * as style from './style.module.scss'
import { useState } from 'react'

type CrudHandlers = {
  onUpdateWeek?: (oldWeek: string, newWeek: string) => Promise<void>
  onDeleteWeek?: (week: string) => Promise<void>
}

interface Props {
  text: string
  onClick: () => void
  isActive?: boolean
  crudHandlers?: CrudHandlers
}

export const WeeksButton = ({
  text,
  onClick,
  isActive,
  crudHandlers,
}: Props) => {
  const [isEditing, setIsEditing] = useState(false)
  const [editingValue, setEditingValue] = useState(text)

  const handleSave = async () => {
    if (!crudHandlers?.onUpdateWeek) return
    try {
      await crudHandlers.onUpdateWeek(text, editingValue)
      setIsEditing(false)
    } catch (err) {
      console.error('Ошибка при обновлении недели:', err)
    }
  }

  const handleDelete = async () => {
    if (!crudHandlers?.onDeleteWeek) return
    try {
      await crudHandlers.onDeleteWeek(text)
    } catch (err) {
      console.error('Ошибка при удалении недели:', err)
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
    <div className={style.weekItem}>
      <button
        onClick={onClick}
        className={`${style.button} ${isActive ? style.active : ''}`}
        type="button"
      >
        {text}
      </button>
      {crudHandlers && (
        <div className={style.weekActions}>
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
