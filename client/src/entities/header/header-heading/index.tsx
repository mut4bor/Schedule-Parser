import * as style from './style.module.scss'
import { Link } from 'react-router-dom'

export const HeaderHeading = () => {
  return (
    <Link to={'/'}>
      <h1 className={style.heading}>Расписание НГУ им. Лесгафта</h1>
    </Link>
  )
}
