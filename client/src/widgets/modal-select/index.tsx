import * as style from './style.module.scss'

interface Option {
  value: string
  label: string
}

interface Props {
  label: string
  name: string
  defaultValue?: string
  options: Option[]
}

export const ModalSelect = ({ label, name, defaultValue, options }: Props) => {
  return (
    <label className={style.label}>
      {label}
      <select name={name} className={style.select} defaultValue={defaultValue}>
        {options.map((option) => (
          <option className={style.option} key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  )
}
