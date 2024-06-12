import * as style from './style.module.scss'
import { RadioboxProps } from './types'
import { SVG } from '@/shared/ui/SVG'

export function Radiobox(props: RadioboxProps) {
  const { onChange, title, id, defaultChecked, name, checked } = props
  return (
    <>
      <input
        id={id}
        name={name}
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
