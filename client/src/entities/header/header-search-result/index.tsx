import * as style from './style.module.scss'
import { Link } from 'react-router-dom'
import {
  useGetGroupNamesThatMatchWithReqParamsQuery,
  useAppDispatch,
  useAppSelector,
  weekChanged,
  dayIndexChanged,
} from '@/shared/redux'

export const HeaderSearchResult = () => {
  const dispatch = useAppDispatch()
  const { inputState } = useAppSelector((store) => store.search)

  const searchValue = useAppSelector((store) => store.search.searchValue)

  const namesSearchParams = new URLSearchParams({
    searchValue: searchValue,
  }).toString()

  const { data: namesData, error: namesError } = useGetGroupNamesThatMatchWithReqParamsQuery(namesSearchParams, {
    skip: !searchValue,
  })

  const isNamesData = !!namesData && namesData.length !== 0

  return (
    <div
      className={`
			${style.searchResultWrapper} 
			${isNamesData && inputState.focused && style.focused} 
			${!isNamesData && style.empty}`}
    >
      <div
        className={`
				${style.searchResult} 
				${isNamesData && inputState.focused && style.focused} 
				${!isNamesData && style.empty}`}
      >
        {isNamesData &&
          namesData.map((item, index) => (
            <Link
              onClick={() => {
                dispatch(weekChanged(''))
                dispatch(dayIndexChanged(-1))
              }}
              className={style.link}
              to={`/${item._id}`}
              key={index}
            >
              {item.group}
            </Link>
          ))}
      </div>
    </div>
  )
}
