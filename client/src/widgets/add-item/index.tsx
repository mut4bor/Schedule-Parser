import { useState } from 'react'
import { InlineEdit, AdminAddButton } from '@/entities/admin'

type AddItemProps = {
  label: string
  onAdd: (value: string) => Promise<void>
  type?: 'text' | 'date' | 'week'
  className?: string
}

export const AddItem = ({ label, onAdd, type, className }: AddItemProps) => {
  const [isAdding, setIsAdding] = useState(false)

  return (
    <div className={className}>
      {isAdding ? (
        <InlineEdit
          initialValue=""
          onSave={async (newValue) => {
            await onAdd(newValue)
            setIsAdding(false)
          }}
          onCancel={() => setIsAdding(false)}
          type={type}
        />
      ) : (
        <AdminAddButton onClick={() => setIsAdding(true)}>
          {label}
        </AdminAddButton>
      )}
    </div>
  )
}
