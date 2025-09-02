import * as style from './style.module.scss'

interface Props {
  children: React.ReactNode
  onClick: () => void
}

export const GroupButton = (props: Props) => {
  const { children, onClick } = props
  return (
    <button type="button" className={style.button} onClick={onClick}>
      {children}
    </button>
  )
}
