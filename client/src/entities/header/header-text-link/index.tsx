import * as style from './style.module.scss'
import { Link } from 'react-router-dom'

interface Props {
  text: string
  href: string
}

export const HeaderTextLink = ({ text, href }: Props) => {
  return (
    <Link className={style.link} to={href}>
      {text}
    </Link>
  )
}
