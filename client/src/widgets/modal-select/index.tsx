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
    <label className={style.editLabel}>
      {label}
      <select name={name} className={style.editInput} defaultValue={defaultValue}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  )
}
