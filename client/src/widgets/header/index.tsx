import * as style from './style.module.scss'
import {
  HeaderHeading,
  HeaderInput,
  HeaderLogoutButton,
  HeaderSearchResult,
} from '@/entities/header'
import { useState, useEffect } from 'react'
import { useAppSelector, useGetGroupNamesThatMatchWithReqParamsQuery } from '@/shared/redux'
import { HeaderFavoriteLink } from '@/entities/header/header-favorite-link'

export const Header = () => {
  const accessToken = useAppSelector((store) => store.auth.accessToken)

  const [searchValue, setSearchValue] = useState<string>('')
  const [isSearchInputFocused, setIsSearchInputFocused] = useState<boolean>(false)

  const namesSearchParams = new URLSearchParams({
    searchValue: searchValue,
  }).toString()

  const { data: namesData } = useGetGroupNamesThatMatchWithReqParamsQuery(namesSearchParams, {
    skip: !searchValue,
  })

  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const controlHeader = () => {
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
              <HeaderInput
                setSearchValue={setSearchValue}
                setIsSearchInputFocused={setIsSearchInputFocused}
              />
              <HeaderSearchResult
                namesData={namesData}
                isSearchInputFocused={isSearchInputFocused}
              />
            </div>

            <HeaderFavoriteLink />
            {accessToken && <HeaderLogoutButton />}
          </div>
        </div>
      </div>
    </header>
  )
}
