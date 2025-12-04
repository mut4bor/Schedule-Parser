import * as style from './style.module.scss'
import { useState } from 'react'
import { InlineEdit, EditDeleteActions } from '@/entities/admin'
import { useAppSelector } from '@/shared/redux/hooks'

export type CrudHandlers = {
  onUpdate?: ((newValue: string) => Promise<void>) | null
  onDelete?: (() => Promise<void>) | null
}

interface Props {
  value: string
  crudHandlers?: CrudHandlers | null
  children: React.ReactNode
  className?: string
  type?: 'text' | 'number' | 'date' | 'week' | 'time'
  min?: number | string
  max?: number | string
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
  min,
  max,
  inputClassName,
  saveButtonClassName,
  cancelButtonClassName,
}: Props) => {
  const [isEditing, setIsEditing] = useState(false)

  const handleSave = async (newValue: string) => {
    if (!crudHandlers?.onUpdate) return
    try {
      if (value === newValue) {
        setIsEditing(false)
        return
      }
      await crudHandlers.onUpdate(newValue)
      setIsEditing(false)
    } catch (err) {
      console.error('Ошибка при обновлении:', err)
    }
  }

  const handleDelete = async () => {
    if (!crudHandlers?.onDelete || !window.confirm(`Вы уверены, что хотите удалить ${value}?`))
      return
    try {
      await crudHandlers.onDelete()
    } catch (err) {
      console.error('Ошибка при удалении:', err)
    }
  }

  const accessToken = useAppSelector((store) => store.auth.accessToken)

  if (!accessToken) {
    return children
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
          min={min}
          max={max}
        />
      ) : (
        <>
          <div className={style.item}>{children}</div>
          {crudHandlers && (
            <EditDeleteActions
              onEdit={!!crudHandlers?.onUpdate ? () => setIsEditing(true) : null}
              onDelete={!!crudHandlers?.onDelete ? handleDelete : null}
              isLocked={false}
            />
          )}
        </>
      )}
    </div>
  )
}
