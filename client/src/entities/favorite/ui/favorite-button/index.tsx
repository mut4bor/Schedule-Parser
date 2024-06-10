import * as style from './style.module.scss'
import { SVG } from '@/shared/ui'

export const FavoriteButton = () => {
  return (
    <a className={style.link} title="Избранная группа" target="_blank" href="https://t.me/mut4bor">
      <SVG href="#star" svgClassName={style.svg} />
    </a>
  )
}
