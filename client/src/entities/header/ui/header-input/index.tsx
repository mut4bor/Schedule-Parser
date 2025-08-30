import * as style from './style.module.scss'
import { useDebounceCallback } from 'usehooks-ts'
import {
  useAppDispatch,
  isSearchInputFocusedChanged,
  searchValueChanged,
} from '@/shared/redux'
import { SVG } from '@/shared/ui/SVG'

export const HeaderInput = () => {
  const dispatch = useAppDispatch()

  const handleChange = useDebounceCallback((event) => {
    dispatch(searchValueChanged(event.target.value))
  }, 300)

  const handleOnBlur = () => {
    const timer = setTimeout(() => {
      dispatch(isSearchInputFocusedChanged(false))
    }, 300)

    return () => clearTimeout(timer)
  }

  return (
    <label className={style.label}>
      <SVG
        href="#search"
        svgClassName={style.searchSvg}
        useClassName={style.searchUse}
      />
      <input
        placeholder="Поиск группы"
        className={`${style.input}`}
        type="text"
        onFocus={() => dispatch(isSearchInputFocusedChanged(true))}
        onBlur={handleOnBlur}
        onChange={handleChange}
      />
    </label>
  )
}
