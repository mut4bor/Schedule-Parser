import * as style from './style.module.scss'
import { useState } from 'react'
import { InlineEdit, AdminAddButton } from '@/entities/admin'

interface AddItemProps {
  children: React.ReactNode
  onAdd: (value: string) => Promise<void>
  type?: 'text' | 'number' | 'date' | 'week' | 'time'
  min?: number
  max?: number
  className?: string
}

export const AddItem = ({
  children,
  onAdd,
  type,
  min,
  max,
  className,
}: AddItemProps) => {
  const [isAdding, setIsAdding] = useState(false)

  return (
    <div className={`${style.container} ${className}`}>
      {isAdding ? (
        <InlineEdit
          initialValue=""
          onSave={async (newValue) => {
            await onAdd(newValue)
            setIsAdding(false)
          }}
          onCancel={() => setIsAdding(false)}
          type={type}
          min={min}
          max={max}
        />
      ) : (
        <AdminAddButton onClick={() => setIsAdding(true)}>
          {children}
        </AdminAddButton>
      )}
    </div>
  )
}
