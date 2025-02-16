import { useId } from 'react'
import * as style from './style.module.scss'
import { RadioboxProps } from './types'
import { SVG } from '@/shared/ui/SVG'

export function Radiobox({
  onChange,
  title,
  defaultChecked,
  checked,
}: RadioboxProps) {
  const id = useId()

  return (
    <>
      <input
        id={id}
        defaultChecked={defaultChecked}
        checked={checked}
        className={style.checkbox}
        type="checkbox"
        onChange={onChange}
      />
      <label htmlFor={id}>
        <span className={style.labelbox}>
          <SVG href={'#checkmark'} svgClassName={style.labelboxSvg} />
        </span>
        {title}
      </label>
    </>
  )
}
