import * as style from './style.module.scss'
import { useDebouncedCallback } from 'use-debounce'
import { useAppDispatch, searchValueChanged, useAppSelector, inputStateChanged } from '@/shared/redux'
import { SVG } from '@/shared/ui/SVG'

export const HeaderInput = () => {
  const dispatch = useAppDispatch()

  const inputState = useAppSelector((store) => store.search.inputState)

  const debouncedDispatchSearchValue = useDebouncedCallback(() => {
    dispatch(searchValueChanged(inputState.value))
  }, 300)

  const debouncedOnBlur = useDebouncedCallback(() => {
    dispatch(inputStateChanged({ ...inputState, focused: false }))
  }, 300)

  return (
    <>
      <SVG href="#search" svgClassName={style.searchSvg} useClassName={style.searchUse} />
      <input
        placeholder="Поиск группы"
        className={`${style.input}`}
        type="text"
        value={inputState.value}
        onFocus={() => dispatch(inputStateChanged({ ...inputState, focused: true }))}
        onBlur={debouncedOnBlur}
        onChange={(event) => {
          dispatch(inputStateChanged({ ...inputState, value: event.target.value }))
          debouncedDispatchSearchValue()
        }}
      />
    </>
  )
}
