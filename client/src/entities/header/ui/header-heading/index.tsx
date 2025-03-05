import * as style from './style.module.scss'
import { Link } from 'react-router-dom'
import routes from '@/shared/routes'

export const HeaderHeading = () => {
  return (
    <Link className={style.link} to={routes.BASE_URL}>
      <h1 className={style.heading}>Расписание НГУ им. Лесгафта</h1>
    </Link>
  )
}
