import * as style from './style.module.scss'

interface Props {
  children: React.ReactNode
  onClick: () => void
  isActive?: boolean
}

export const DaysButton = ({ children, onClick, isActive }: Props) => {
  return (
    <button
      onClick={onClick}
      className={`${style.button} ${isActive ? style.active : null}`}
      type="button"
    >
      {children}
    </button>
  )
}
