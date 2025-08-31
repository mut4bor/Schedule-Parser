import * as style from './style.module.scss'
import { useState } from 'react'
import { InlineEdit, EditDeleteActions } from '@/entities/admin'

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

  const handleSave = async (newValue: string) => {
    if (!crudHandlers?.onUpdateWeek) return
    try {
      await crudHandlers.onUpdateWeek(text, newValue)
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
      <InlineEdit
        initialValue={text}
        onSave={handleSave}
        onCancel={() => setIsEditing(false)}
      />
    )
  }

  return (
    <div className={style.container}>
      <button
        onClick={onClick}
        className={`${style.button} ${isActive ? style.active : ''}`}
        type="button"
      >
        {text}
      </button>
      {crudHandlers && (
        <EditDeleteActions
          onEdit={() => setIsEditing(true)}
          onDelete={handleDelete}
        />
      )}
    </div>
  )
}
