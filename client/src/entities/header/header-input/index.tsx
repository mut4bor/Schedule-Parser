import * as style from './style.module.scss'
import { useDebounceCallback } from 'usehooks-ts'

interface Props {
  setSearchValue: (value: string) => void
  setIsSearchInputFocused: (value: boolean) => void
}

export const HeaderInput = ({
  setSearchValue,
  setIsSearchInputFocused,
}: Props) => {
  const handleChange = useDebounceCallback((event) => {
    setSearchValue(event.target.value)
  }, 300)

  const handleOnBlur = () => {
    const timer = setTimeout(() => {
      setIsSearchInputFocused(false)
    }, 300)

    return () => clearTimeout(timer)
  }

  return (
    <label className={style.label}>
      <svg className={style.searchSvg} viewBox="0 0 512 512">
        <path
          d="M221.09,64A157.09,157.09,0,1,0,378.18,221.09,157.1,157.1,0,0,0,221.09,64Z"
          style={{
            fill: 'none',
            stroke: '#e1e3e6',
            strokeMiterlimit: 10,
            strokeWidth: 32,
          }}
        />
        <line
          style={{
            fill: 'none',
            stroke: '#e1e3e6',
            strokeLinecap: 'round',
            strokeMiterlimit: 10,
            strokeWidth: 32,
          }}
          x1="338.29"
          x2="448"
          y1="338.29"
          y2="448"
        />
      </svg>
      <input
        placeholder="Поиск группы"
        className={`${style.input}`}
        type="text"
        onFocus={() => setIsSearchInputFocused(true)}
        onBlur={handleOnBlur}
        onChange={handleChange}
      />
    </label>
  )
}
