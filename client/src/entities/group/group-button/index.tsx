import * as style from './style.module.scss'

type GroupButtonProps = {
  children: React.ReactNode
  onClick: () => void
}

export const GroupButton = (props: GroupButtonProps) => {
  const { children, onClick } = props
  return (
    <button type="button" className={style.button} onClick={onClick}>
      {children}
    </button>
  )
}
