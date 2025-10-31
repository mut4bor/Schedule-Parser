import * as style from './style.module.scss'

interface Props {
  label: string
  type?: 'text' | 'number' | 'date' | 'week' | 'time'
  name: string
  defaultValue: string
}

export const ModalInput = ({ label, name, defaultValue, type = 'text' }: Props) => {
  return (
    <label className={style.editLabel}>
      {label}
      <input name={name} className={style.editInput} defaultValue={defaultValue} type={type} />
    </label>
  )
}
