import * as style from './style.module.scss'
import { HeaderContact } from './header-contact'
import { HeaderHeading } from './header-heading'
import { HeaderInput } from './header-input'
import { useState, useEffect } from 'react'

export const Header = () => {
  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)

  const controlHeader = () => {
    if (typeof window !== 'undefined') {
      if (window.scrollY > 120) {
        if (window.scrollY > lastScrollY) {
          setIsVisible(false)
        } else {
          setIsVisible(true)
        }
      } else {
        setIsVisible(true)
      }
      setLastScrollY(window.scrollY)
    }
  }

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', controlHeader)

      return () => {
        window.removeEventListener('scroll', controlHeader)
      }
    }
  }, [lastScrollY])

  return (
    <header className={`${style.header} ${isVisible ? style.visible : style.hidden}`}>
      <HeaderContact />
      <div className={style.wrapper}>
        <div className={style.container}>
          <HeaderHeading />
          <HeaderInput />
        </div>
      </div>
    </header>
  )
}
