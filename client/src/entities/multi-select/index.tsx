import { useState } from 'react'
import style from './style.module.scss'

interface Option {
  label: string
  value: string
}

interface Props {
  options: Option[]
  onChange?: (selected: string[]) => void
  defaultValue?: string
}

export const MultiSelect = ({ options, onChange, defaultValue }: Props) => {
  const [selected, setSelected] = useState<string[]>(
    defaultValue ? [defaultValue] : [],
  )
  const [open, setOpen] = useState(false)

  const toggleOption = (value: string) => {
    const newSelected = selected.includes(value)
      ? selected.filter((v) => v !== value)
      : [...selected, value]

    setSelected(newSelected)
    onChange?.(newSelected)
  }

  return (
    <div className={style.multiSelect}>
      <div className={style.control} onClick={() => setOpen((prev) => !prev)}>
        <span className={style.selectedValue}>
          {selected.length > 0
            ? selected
                .map((v) => options.find((o) => o.value === v)?.label)
                .join(', ')
            : 'Выберите значения'}
        </span>
        <span className={style.arrow}>{open ? '▲' : '▼'}</span>
      </div>

      {open && (
        <ul className={style.dropdown}>
          {options.map((option) => (
            <li
              key={option.value}
              className={`${style.option} ${
                selected.includes(option.value) ? style.selected : ''
              }`}
              onClick={() => toggleOption(option.value)}
            >
              <input
                type="checkbox"
                checked={selected.includes(option.value)}
                readOnly
              />
              <span>{option.label}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
