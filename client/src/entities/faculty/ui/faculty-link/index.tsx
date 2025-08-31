import * as style from './style.module.scss'
import { Link } from 'react-router-dom'

type Props = {
  faculty: string
  href: string
}

export const FacultyLink = ({ faculty, href }: Props) => {
  return (
    <Link className={style.link} to={href}>
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
