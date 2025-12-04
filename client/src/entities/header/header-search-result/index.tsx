import * as style from './style.module.scss'
import { Link } from 'react-router-dom'
import { IName } from '@/shared/redux/slices/api/namesApi'

interface Props {
  namesData?: IName[]
  isSearchInputFocused: boolean
}

export const HeaderSearchResult = ({ namesData, isSearchInputFocused }: Props) => {
  const isNamesData = !!namesData && namesData.length !== 0

  return (
    <div
      className={`
			${style.searchResultWrapper} 
			${isNamesData && isSearchInputFocused ? style.focused : null} 
			${!isNamesData ? style.empty : null}`}
    >
      <div
        className={`
				${style.searchResult} 
				${isNamesData && isSearchInputFocused ? style.focused : null} 
				${!isNamesData ? style.empty : null}`}
      >
        {isNamesData &&
          namesData.map((item, index) => (
            <Link className={style.link} to={`/groups/${item._id}`} replace key={index}>
              {item.name}
            </Link>
          ))}
      </div>
    </div>
  )
}
