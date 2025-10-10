import routes from '@/shared/routes'
import * as style from './style.module.scss'
import { Link } from 'react-router-dom'

export const HeaderGroupsEditLink = () => {
  return (
    <Link to={routes.GROUPS_EDIT_PATH} className={style.button}>
      Редактировать группы
    </Link>
  )
}
