import * as style from './style.module.scss'

interface Props {
  children: React.ReactNode
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void
  onCancel?: () => void
}

export const ModalForm = ({ children, onSubmit, onCancel }: Props) => {
  return (
    <form className={style.form} onSubmit={onSubmit}>
      {children}

      <div className={style.formButtons}>
        <button type="submit" className={style.submitButton}>
          Сохранить
        </button>

        <button type="button" className={style.cancelButton} onClick={onCancel}>
          Отмена
        </button>
      </div>
    </form>
  )
}
