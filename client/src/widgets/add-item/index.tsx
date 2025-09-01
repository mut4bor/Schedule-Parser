import { useState } from 'react'
import { InlineEdit, AdminAddButton } from '@/entities/admin'

type AddItemProps = {
  children: React.ReactNode
  onAdd: (value: string) => Promise<void>
  type?: 'text' | 'date' | 'week'
  className?: string
}

export const AddItem = ({ children, onAdd, type, className }: AddItemProps) => {
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
          {children}
        </AdminAddButton>
      )}
    </div>
  )
}
