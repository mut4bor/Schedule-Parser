import style from './style.module.scss'

type AdminAddButtonProps = {
  onClick: () => void
  className?: string
  children: React.ReactNode
  isLocked: boolean
}

export const AdminAddButton = ({ onClick, className, children, isLocked }: AdminAddButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={`${style.addButton} ${isLocked ? `${style.isLocked}` : ''} ${className ? ` ${className}` : ''}`}
      disabled={isLocked}
    >
      ➕ {children}
    </button>
  )
}
