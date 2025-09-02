import * as style from './style.module.scss'
import { useState } from 'react'

type InlineEditProps = {
  initialValue: string
  onSave: (value: string) => Promise<void> | void
  onCancel?: () => void
  className?: string
  inputClassName?: string
  saveButtonClassName?: string
  cancelButtonClassName?: string
  type?: 'text' | 'number' | 'date' | 'week' | 'time'
  min?: number
  max?: number
}

export const InlineEdit = ({
  initialValue,
  onSave,
  onCancel,
  className,
  inputClassName,
  saveButtonClassName,
  cancelButtonClassName,
  type = 'text',
  min,
  max,
}: InlineEditProps) => {
  const [value, setValue] = useState(initialValue)

  const handleSave = async () => {
    await onSave(value)
  }

  const handleCancel = () => {
    setValue(initialValue)
    onCancel?.()
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleSave()
    } else if (e.key === 'Escape') {
      e.preventDefault()
      handleCancel()
    }
  }

  return (
    <div className={`${style.editForm} ${className || ''}`}>
      <input
        type={type}
        name={type}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        className={`${style.editInput} ${inputClassName || ''}`}
        {...(type === 'number' ? { min, max } : {})}
      />
      <button
        onClick={handleSave}
        className={`${style.saveButton} ${saveButtonClassName || ''}`}
      >
        ✓
      </button>
      <button
        onClick={handleCancel}
        className={`${style.cancelButton} ${cancelButtonClassName || ''}`}
      >
        ✕
      </button>
    </div>
  )
}
