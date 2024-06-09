import * as style from './style.module.scss'
import { FacultyLinkProps } from './types'
import { Link } from 'react-router-dom'

export const FacultyLink = ({ faculty, handleLinkClick, href }: FacultyLinkProps) => {
  return (
    <Link className={style.link} to={href} onClick={() => handleLinkClick(faculty)}>
      <ul className={style.list}>
        {faculty.split(',').map((item) => (
          <li className={style.listElement} key={item}>
            {item}
          </li>
        ))}
      </ul>
    </Link>
  )
}
