import routes from '@/shared/routes'
import * as style from './style.module.scss'
import { Link } from 'react-router-dom'

export const HeaderTeachersLink = () => {
  return (
    <Link to={routes.TEACHERS_PATH} className={style.button}>
      Преподаватели
    </Link>
  )
}
