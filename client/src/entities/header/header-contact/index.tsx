import * as style from './style.module.scss'

export const HeaderContact = () => {
  return (
    <>
      <div className={style.wrapper}>
        <div className={style.container}>
          <div className={style.contact}>
            <a target="_blank" href="https://github.com/mut4bor/Schedule-Parser">
              Project on GitHub
            </a>
            <a target="_blank" href="https://t.me/mut4bor">
              Telegram: @mut4bor
            </a>
          </div>
        </div>
      </div>
    </>
  )
}
