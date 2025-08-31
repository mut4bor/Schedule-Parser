import * as style from './style.module.scss'
import { useState } from 'react'
import { InlineEdit, EditDeleteActions } from '@/entities/admin'

export type CrudHandlers = {
  onUpdate?: (oldValue: string, newValue: string) => Promise<void>
  onDelete?: (value: string) => Promise<void>
}

interface Props {
  value: string
  crudHandlers?: CrudHandlers
  children: React.ReactNode
  className?: string
}

export const EditableItem = ({
  value,
  crudHandlers,
  children,
  className,
}: Props) => {
  const [isEditing, setIsEditing] = useState(false)

  const handleSave = async (newValue: string) => {
    if (!crudHandlers?.onUpdate) return
    try {
      await crudHandlers.onUpdate(value, newValue)
      setIsEditing(false)
    } catch (err) {
      console.error('Ошибка при обновлении:', err)
    }
  }

  const handleDelete = async () => {
    if (!crudHandlers?.onDelete) return
    try {
      await crudHandlers.onDelete(value)
    } catch (err) {
      console.error('Ошибка при удалении:', err)
    }
  }

  if (isEditing) {
    return (
      <InlineEdit
        initialValue={value}
        onSave={handleSave}
        onCancel={() => setIsEditing(false)}
      />
    )
  }

  return (
    <div className={`${style.container} ${className ? className : ''}`}>
      <div className={style.item}>{children}</div>
      {crudHandlers && (
        <EditDeleteActions
          onEdit={() => setIsEditing(true)}
          onDelete={handleDelete}
        />
      )}
    </div>
  )
}
