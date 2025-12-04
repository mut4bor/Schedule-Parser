import * as style from './style.module.scss'
import { Link } from 'react-router-dom'

interface Props {
  text: string
  href: string
}

export const HeaderLink = ({ text, href }: Props) => {
  return (
    <Link to={href} className={style.link}>
      {text}
    </Link>
  )
}
