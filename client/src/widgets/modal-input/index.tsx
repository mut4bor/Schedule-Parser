import * as style from './style.module.scss'

interface Props {
  label: string
  type?: 'text' | 'number' | 'date' | 'week' | 'time'
  name: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export const ModalInput = ({ label, name, value, onChange, type = 'text' }: Props) => {
  return (
    <label className={style.label}>
      {label}
      <input name={name} className={style.input} type={type} value={value} onChange={onChange} />
    </label>
  )
}
