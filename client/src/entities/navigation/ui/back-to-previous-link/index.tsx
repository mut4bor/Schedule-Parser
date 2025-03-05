import * as style from './style.module.scss'
import { BackToPreviousButtonProps } from './types'
import { Link } from 'react-router-dom'

export const BackToPreviousLink = ({ href }: BackToPreviousButtonProps) => {
  return (
    <Link to={href} className={style.link}>
      Назад
    </Link>
  )
}
