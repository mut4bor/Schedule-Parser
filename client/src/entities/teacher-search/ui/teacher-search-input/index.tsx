import * as style from './style.module.scss'
import { SVG } from '@/shared/ui/SVG'
import { TeacherSearchInputProps } from './types'

export const TeacherSearchInput = ({
  value,
  onChange,
}: TeacherSearchInputProps) => {
  return (
    <label className={style.label}>
      <SVG
        href="#search"
        svgClassName={style.searchSvg}
        useClassName={style.searchUse}
      />
      <input
        placeholder="Поиск преподавателя"
        className={`${style.input}`}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  )
}
