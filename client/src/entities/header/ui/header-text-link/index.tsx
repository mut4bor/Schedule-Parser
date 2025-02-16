import * as style from './style.module.scss'
import { HeaderTextLinkProps } from './types'
import { Link } from 'react-router-dom'

export const HeaderTextLink = ({ text, href }: HeaderTextLinkProps) => {
  return (
    <Link className={style.link} to={href}>
      {text}
    </Link>
  )
}
