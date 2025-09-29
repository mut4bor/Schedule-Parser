import style from './style.module.scss'

type AdminAddButtonProps = {
  onClick: () => void
  className?: string
  children: React.ReactNode
}

export const AdminAddButton = ({
  onClick,
  className,
  children,
}: AdminAddButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={`${style.addButton}${className ? ` ${className}` : ''}`}
    >
      ➕ {children}
    </button>
  )
}
