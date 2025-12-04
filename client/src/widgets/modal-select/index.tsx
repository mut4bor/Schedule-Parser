import * as style from './style.module.scss'

interface Option {
  value: string
  label: string
}

interface Props {
  label: string
  name: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
  options: Option[]
  isWarning?: boolean
}

export const ModalSelect = ({ label, name, value, onChange, options, isWarning }: Props) => {
  return (
    <label className={style.label}>
      {label}
      <select
        name={name}
        className={`${style.select} ${isWarning ? style.isWarning : ''}`}
        value={value}
        onChange={onChange}
      >
        <option value="" disabled>
          Выберите значение
        </option>
        {options.map((option) => (
          <option className={style.option} key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  )
}
