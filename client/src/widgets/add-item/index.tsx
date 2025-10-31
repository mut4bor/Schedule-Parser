import * as style from './style.module.scss'
import { AdminAddButton } from '@/entities/admin'

interface AddItemProps {
  addButtonLabel: React.ReactNode
  children: React.ReactNode
  className?: string
  isAdding: boolean
  setIsAdding: (isAdding: boolean) => void
}

export const AddItem = ({
  addButtonLabel,
  children,
  className,
  isAdding,
  setIsAdding,
}: AddItemProps) => {
  return (
    <div className={`${style.container} ${className}`}>
      {isAdding ? (
        children
      ) : (
        <AdminAddButton onClick={() => setIsAdding(true)}>{addButtonLabel}</AdminAddButton>
      )}
    </div>
  )
}
