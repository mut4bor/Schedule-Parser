import * as style from './style.module.scss'

export const Footer = () => {
  return (
    <footer className={style.footer}>
      <div className={style.container}>
        <a className={style.link} href="https://t.me/mut4bor" target="_blank">
          Разработчик сайта - <span className={style.mut4bor}>@mut4bor</span>
        </a>
      </div>
    </footer>
  )
}
