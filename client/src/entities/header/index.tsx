import * as style from './style.module.scss'
import { HeaderContact } from './header-contact'
import { HeaderHeading } from './header-heading'
import { HeaderInput } from './header-input'

export const Header = () => {
  return (
    <>
      <header className={style.header}>
        <HeaderContact />
        <div className={style.wrapper}>
          <div className={style.container}>
            <HeaderHeading />
            <HeaderInput />
          </div>
        </div>
      </header>
    </>
  )
}
