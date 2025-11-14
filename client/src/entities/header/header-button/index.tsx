import * as style from './style.module.scss'

interface Props {
  text: string
  onClick: () => void
}

export const HeaderButton = ({ text, onClick }: Props) => {
  return (
    <button className={style.button} onClick={onClick}>
      {text}
    </button>
  )
}
