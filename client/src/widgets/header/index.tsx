import * as style from './style.module.scss'
import {
  HeaderButton,
  HeaderHeading,
  HeaderInput,
  HeaderLink,
  HeaderSearchResult,
} from '@/entities/header'
import { useState, useEffect } from 'react'
import { useAppSelector } from '@/shared/redux/hooks'
import { useGetGroupNamesThatMatchWithReqParamsQuery } from '@/shared/redux/slices/api/namesApi'
import { useLogoutMutation } from '@/shared/redux/slices/api/authApi'
import routes from '@/shared/routes'

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

  const [isMenuOpened, setIsMenuOpened] = useState(false)

  const [logout] = useLogoutMutation()

  useEffect(() => {
    const controlHeader = () => {
      if (typeof window === 'undefined') {
        return
      }

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

            <button className={style.menuButton} onClick={() => setIsMenuOpened((prev) => !prev)}>
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  className={style.menuIcon}
                  d="M3 12H21M3 6H21M3 18H21"
                  stroke="#fff"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </button>

            {isMenuOpened && (
              <div className={style.menu}>
                <HeaderLink text="Избранная группа" href={routes.FAVORITE_PATH} />
                <HeaderLink text="Расписание преподавателей" href={routes.TEACHERS_SCHEDULE_PATH} />
                <HeaderLink text="Расписание аудиторий" href={routes.CLASSROOMS_SCHEDULE_PATH} />
                {accessToken && (
                  <>
                    <HeaderLink
                      text="Редактирование расписания групп"
                      href={routes.GROUPS_EDIT_PATH}
                    />
                    <HeaderLink text="Редактирование аудиторий" href={routes.CLASSROOMS_PATH} />
                    <HeaderButton text="Выйти" onClick={logout} />
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
