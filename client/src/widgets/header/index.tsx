import * as style from './style.module.scss'
import {
  HeaderGithubLink,
  HeaderHeading,
  HeaderInput,
  HeaderLoginButton,
  HeaderSearchResult,
  HeaderTelegramLink,
} from '@/entities/header'
import { useState, useEffect } from 'react'
import {
  useGetGroupNamesThatMatchWithReqParamsQuery,
  useAppSelector,
} from '@/shared/redux'
import { HeaderTextLink } from '@/entities/header/ui/header-text-link'
import routes from '@/shared/routes'
import { HeaderFavoriteLink } from '@/entities/header/ui/header-favorite-link'

export const Header = () => {
  const searchValue = useAppSelector((store) => store.search.searchValue)

  const namesSearchParams = new URLSearchParams({
    searchValue: searchValue,
  }).toString()

  const { data: namesData, error: namesError } =
    useGetGroupNamesThatMatchWithReqParamsQuery(namesSearchParams, {
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
    <header
      className={`${style.header} ${isVisible ? style.visible : style.hidden}`}
    >
      <div className={style.wrapper}>
        <div className={style.container}>
          <HeaderHeading />

          <div className={style.content}>
            <div className={style.inputGroup}>
              <HeaderInput />
              <HeaderSearchResult namesData={namesData} />
            </div>
            {/* <HeaderTextLink
              text="Преподаватели"
              href={routes.TEACHER_SEARCH_PATH}
            />
            <HeaderTextLink text="Избранное" href={routes.FAVORITE_PATH} /> */}
            <HeaderGithubLink />
            <HeaderTelegramLink />
            <HeaderFavoriteLink />
            <HeaderLoginButton onClick={() => {}} />
          </div>
        </div>
      </div>
    </header>
  )
}
