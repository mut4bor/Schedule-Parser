import { Link } from 'react-router-dom'
import * as style from './style.module.scss'
import routes from '@/shared/routes'
import { SVG } from '@/shared/ui'

export const HeaderFavoriteLink = () => {
  return (
    <Link to={routes.FAVORITE_PATH} className={style.favorite}>
      <SVG href="#heart" svgClassName={style.favoriteSvg} />
    </Link>
  )
}
