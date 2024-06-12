import * as style from './style.module.scss'
import { TabBarLinkProps } from './types'
import { Link } from 'react-router-dom'
import { SVG } from '@/shared/ui'

export const TabBarLink = ({ href, text, onClick, svgHref }: TabBarLinkProps) => {
  return (
    <Link to={href} className={style.link} onClick={onClick}>
      <SVG href={svgHref} svgClassName={style.svg} />
      <p>{text}</p>
    </Link>
  )
}
