import * as style from './style.module.scss'
import { Link } from 'react-router-dom'

interface Props {
  href: string
}

export const BackToPreviousLink = ({ href }: Props) => {
  return (
    <Link to={href} className={style.link}>
      Назад
    </Link>
  )
}
