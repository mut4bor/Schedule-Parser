import * as style from './style.module.scss'

interface Props {
  text: string
  onClick: () => void
  isActive?: boolean
}

export const WeeksButton = ({ text, onClick, isActive }: Props) => {
  return (
    <button
      onClick={onClick}
      className={`${style.button} ${isActive ? style.active : ''}`}
      type="button"
    >
      {text}
    </button>
  )
}
