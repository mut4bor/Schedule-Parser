import * as style from './style.module.scss'

interface Props {
  children: React.ReactNode
  onClick: () => void
  isActive?: boolean
}

export const WeeksButton = ({ children, onClick, isActive }: Props) => {
  return (
    <button
      onClick={onClick}
      className={`${style.button} ${isActive ? style.active : ''}`}
      type="button"
    >
      {children}
    </button>
  )
}
