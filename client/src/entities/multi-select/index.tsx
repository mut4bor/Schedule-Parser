import { useState, useCallback, useMemo, useEffect } from 'react'
import style from './style.module.scss'

interface Option {
  label: string
  value: string
}

interface Props {
  options: Option[]
  onChange?: (selected: string[]) => void
  defaultValue?: string | string[]
  alwaysOpen?: boolean
}

const OptionItem = ({
  option,
  isSelected,
  onToggle,
}: {
  option: Option
  isSelected: boolean
  onToggle: (value: string) => void
}) => (
  <li className={`${style.option} ${isSelected ? style.selected : ''}`}>
    <button
      type="button"
      className={style.optionButton}
      onClick={() => onToggle(option.value)}
      aria-pressed={isSelected}
    >
      <input type="checkbox" className={style.input} checked={isSelected} readOnly tabIndex={-1} />
      <span>{option.label}</span>
    </button>
  </li>
)

export const MultiSelect = ({ options, onChange, defaultValue, alwaysOpen = false }: Props) => {
  const [selected, setSelected] = useState<Set<string>>(() => {
    const initial = defaultValue
      ? Array.isArray(defaultValue)
        ? defaultValue
        : [defaultValue]
      : []
    return new Set(initial)
  })
  const [open, setOpen] = useState(alwaysOpen)

  const optionsMap = useMemo(() => new Map(options.map((o) => [o.value, o.label])), [options])

  useEffect(() => {
    onChange?.(Array.from(selected))
  }, [selected, onChange])

  const toggleOption = useCallback((value: string) => {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(value)) {
        next.delete(value)
      } else {
        next.add(value)
      }
      return next
    })
  }, [])

  const toggleDropdown = useCallback(() => {
    if (!alwaysOpen) setOpen((prev) => !prev)
  }, [alwaysOpen])

  const selectedLabel = useMemo(() => {
    if (selected.size === 0) return 'Выберите значения'
    return Array.from(selected)
      .map((v) => optionsMap.get(v))
      .filter(Boolean)
      .join(', ')
  }, [selected, optionsMap])

  return (
    <div className={style.multiSelect}>
      {!alwaysOpen && (
        <button
          type="button"
          className={style.control}
          onClick={toggleDropdown}
          aria-expanded={open}
          aria-haspopup="listbox"
        >
          <span className={style.selectedValue}>{selectedLabel}</span>
          <span className={style.arrow} aria-hidden="true">
            {open ? '▲' : '▼'}
          </span>
        </button>
      )}

      {(alwaysOpen || open) && (
        <ul
          className={`${style.dropdown} ${alwaysOpen ? style.alwaysOpen : ''}`}
          role="listbox"
          aria-multiselectable="true"
        >
          {options.map((option) => (
            <OptionItem
              key={option.value}
              option={option}
              isSelected={selected.has(option.value)}
              onToggle={toggleOption}
            />
          ))}
        </ul>
      )}
    </div>
  )
}
