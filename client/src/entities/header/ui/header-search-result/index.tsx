import * as style from './style.module.scss'
import { HeaderSearchResultProps } from './types'
import { Link } from 'react-router-dom'
import { useAppSelector } from '@/shared/redux'

export const HeaderSearchResult = ({ namesData }: HeaderSearchResultProps) => {
  const inputIsFocused = useAppSelector((store) => store.search.inputIsFocused)

  const isNamesData = !!namesData && namesData.length !== 0

  return (
    <div
      className={`
			${style.searchResultWrapper} 
			${isNamesData && inputIsFocused ? style.focused : null} 
			${!isNamesData ? style.empty : null}`}
    >
      <div
        className={`
				${style.searchResult} 
				${isNamesData && inputIsFocused ? style.focused : null} 
				${!isNamesData ? style.empty : null}`}
      >
        {isNamesData &&
          namesData.map((item, index) => (
            <Link
              className={style.link}
              to={`/groupID/${item._id}`}
              key={index}
            >
              {item.group}
            </Link>
          ))}
      </div>
    </div>
  )
}
