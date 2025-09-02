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
  type?: 'text' | 'date' | 'week'
  inputClassName?: string
  saveButtonClassName?: string
  cancelButtonClassName?: string
}

export const EditableItem = ({
  value,
  crudHandlers,
  children,
  className,
  type = 'text',
  inputClassName,
  saveButtonClassName,
  cancelButtonClassName,
}: Props) => {
  const [isEditing, setIsEditing] = useState(false)

  const handleSave = async (newValue: string) => {
    if (!crudHandlers?.onUpdate) return
    try {
      if (value === newValue) {
        // setIsEditing(false)
        // return
      }
      await crudHandlers.onUpdate(value, newValue)
      setIsEditing(false)
    } catch (err) {
      console.error('Ошибка при обновлении:', err)
    }
  }

  const handleDelete = async () => {
    if (
      !crudHandlers?.onDelete ||
      !window.confirm(`Вы уверены, что хотите удалить ${value}?`)
    )
      return
    try {
      await crudHandlers.onDelete(value)
    } catch (err) {
      console.error('Ошибка при удалении:', err)
    }
  }

  return (
    <div className={`${style.container} ${className ? className : ''}`}>
      {isEditing ? (
        <InlineEdit
          initialValue={value}
          onSave={handleSave}
          onCancel={() => setIsEditing(false)}
          type={type}
          inputClassName={inputClassName}
          saveButtonClassName={saveButtonClassName}
          cancelButtonClassName={cancelButtonClassName}
        />
      ) : (
        <>
          <div className={style.item}>{children}</div>
          {crudHandlers && (
            <EditDeleteActions
              onEdit={
                !!crudHandlers?.onUpdate ? () => setIsEditing(true) : null
              }
              onDelete={!!crudHandlers?.onDelete ? handleDelete : null}
            />
          )}
        </>
      )}
    </div>
  )
}
