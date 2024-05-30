import * as style from './style.module.scss'
import { SVG } from '@/shared/ui/SVG'
import { useGetNamesQuery } from '@/shared/redux/slices/apiSlice'
import { useDispatch } from 'react-redux'
import { searchValueChanged } from '@/shared/redux/slices/searchSlice'
import { useDebouncedCallback } from 'use-debounce'
import { useEffect, useState } from 'react'
import { useAppSelector } from '@/shared/redux/hooks'
import { IName } from '@/shared/redux/slices/types'
import { Link } from 'react-router-dom'

export const HeaderInput = () => {
  const [inputState, setInputState] = useState({
    value: '',
    focused: false,
  })
  const dispatch = useDispatch()
  const { data, error } = useGetNamesQuery()

  const [parsedData, setParsedData] = useState<IName[]>()
  const searchValue = useAppSelector((store) => store.search.searchValue)

  useEffect(() => {
    if (data) {
      const lowerCaseSearchValue = searchValue.toLowerCase()

      const sortedData = [...data].sort((a, b) => a.index - b.index)
      if (searchValue) {
        const filteredData = sortedData.filter((item) => {
          return item.group.toLowerCase().includes(lowerCaseSearchValue)
        })
        if (filteredData.length !== 0) {
          setParsedData(filteredData)
          return
        }
      }
      setParsedData(undefined)
    }
  }, [data, searchValue])

  const debouncedValue = useDebouncedCallback(() => {
    dispatch(searchValueChanged(inputState.value))
  }, 300)

  const debouncedOnBlur = useDebouncedCallback(() => {
    setInputState((prevState) => ({ ...prevState, focused: false }))
  }, 100)

  return (
    <>
      <div className={style.inputWrapper}>
        <SVG href="#search" svgClassName={style.searchSvg} useClassName={style.searchUse} />
        <input
          title="Поиск группы"
          placeholder="Поиск группы"
          className={`${style.input} ${inputState.focused && parsedData && style.focused}`}
          type="text"
          value={inputState.value}
          onFocus={() => setInputState((prevState) => ({ ...prevState, focused: true }))}
          onBlur={debouncedOnBlur}
          onChange={(event) => {
            setInputState((prevState) => ({ ...prevState, value: event.target.value }))
            debouncedValue()
          }}
        />

        <div
          className={`
						${style.searchResultWrapper} 
						${parsedData && inputState.focused && style.focused} 
						${!parsedData && style.empty}
						`}
        >
          <div
            className={`
							${style.searchResult} 
							${parsedData && inputState.focused && style.focused} 
							${!parsedData && style.empty}
							`}
          >
            {parsedData &&
              parsedData.map((item, key) => {
                const { _id, group } = item
                return (
                  <Link key={key} className={style.button} to={`/${_id}`}>
                    {group}
                  </Link>
                )
              })}
          </div>
        </div>
      </div>
    </>
  )
}
