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
  isLight?: boolean
}

export const InlineEdit = ({
  initialValue,
  onSave,
  onCancel,
  className,
  inputClassName,
  saveButtonClassName,
  cancelButtonClassName,
  isLight,
}: InlineEditProps) => {
  const [value, setValue] = useState(initialValue)

  const handleSave = async () => {
    await onSave(value)
  }

  const handleCancel = () => {
    setValue(initialValue)
    onCancel?.()
  }

  return (
    <div className={`${style.editForm} ${className || ''}`}>
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className={`${style.editInput} ${isLight ? style.isLight : ''} ${
          inputClassName || ''
        }`}
      />
      <button
        onClick={handleSave}
        className={`${style.saveButton} ${isLight ? style.isLight : ''} ${
          saveButtonClassName || ''
        }`}
      >
        ✓
      </button>
      <button
        onClick={handleCancel}
        className={`${style.cancelButton} ${isLight ? style.isLight : ''} ${
          cancelButtonClassName || ''
        }`}
      >
        ✕
      </button>
    </div>
  )
}
