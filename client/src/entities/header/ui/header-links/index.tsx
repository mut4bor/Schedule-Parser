import * as style from './style.module.scss'
import { SVG } from '@/shared/ui'

export const HeaderLinks = () => {
  return (
    <div className={style.container}>
      <a className={style.link} title="GitHub" target="_blank" href="https://github.com/mut4bor/Schedule-Parser">
        <SVG href="#github" svgClassName={style.githubSvg} />
      </a>
      <a className={style.link} title="Telegram" target="_blank" href="https://t.me/mut4bor">
        <SVG href="#telegram" svgClassName={style.telegramSvg} />
      </a>
    </div>
  )
}
