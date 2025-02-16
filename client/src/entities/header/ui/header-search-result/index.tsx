import * as style from './style.module.scss'
import { HeaderSearchResultProps } from './types'
import { Link } from 'react-router-dom'
import {
  useAppDispatch,
  useAppSelector,
  weekChanged,
  dayIndexChanged,
} from '@/shared/redux'

export const HeaderSearchResult = ({ namesData }: HeaderSearchResultProps) => {
  const dispatch = useAppDispatch()
  const { inputState } = useAppSelector((store) => store.search)

  const isNamesData = !!namesData && namesData.length !== 0

  return (
    <div
      className={`
			${style.searchResultWrapper} 
			${isNamesData && inputState.focused ? style.focused : null} 
			${!isNamesData ? style.empty : null}`}
    >
      <div
        className={`
				${style.searchResult} 
				${isNamesData && inputState.focused ? style.focused : null} 
				${!isNamesData ? style.empty : null}`}
      >
        {isNamesData &&
          namesData.map((item, index) => (
            <Link
              onClick={() => {
                dispatch(weekChanged(''))
                dispatch(dayIndexChanged(-1))
              }}
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
