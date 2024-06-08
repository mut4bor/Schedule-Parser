import * as style from './style.module.scss'
import { HeaderHeading } from './header-heading'
import { HeaderInput } from './header-input'
import { useState, useEffect } from 'react'
import { HeaderSearchResult } from './header-search-result'
import { HeaderLinks } from './header-links'

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
      <div className={style.wrapper}>
        <div className={style.container}>
          <HeaderHeading />
          <div className={style.inputWrapper}>
            <HeaderInput />
            <HeaderSearchResult />
          </div>
          <HeaderLinks />
        </div>
      </div>
    </header>
  )
}
