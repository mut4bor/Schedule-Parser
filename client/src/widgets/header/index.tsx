import * as style from './style.module.scss'
import { HeaderHeading, HeaderInput, HeaderSearchResult, HeaderLinks } from '@/entities/header'
import { useState, useEffect } from 'react'
import { useGetGroupNamesThatMatchWithReqParamsQuery, useAppSelector } from '@/shared/redux'

export const Header = () => {
  const searchValue = useAppSelector((store) => store.search.searchValue)

  const namesSearchParams = new URLSearchParams({
    searchValue: searchValue,
  }).toString()

  const { data: namesData, error: namesError } = useGetGroupNamesThatMatchWithReqParamsQuery(namesSearchParams, {
    skip: !searchValue,
  })

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
          <div className={style.content}>
            <div className={style.inputGroup}>
              <HeaderInput />
              <HeaderSearchResult namesData={namesData} />
            </div>
            <HeaderLinks />
          </div>
        </div>
      </div>
    </header>
  )
}
