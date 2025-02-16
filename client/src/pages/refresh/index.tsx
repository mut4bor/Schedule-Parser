import * as style from './style.module.scss'
import { useState } from 'react'
import { useRefreshScheduleMutation } from '@/shared/redux'
import successSVG from '@/shared/icons/success.svg'
import failureSVG from '@/shared/icons/failure.svg'

export const RefreshPage = () => {
  const [passwordValue, setPasswordValue] = useState('')

  const [refreshSchedule, { isLoading, isSuccess, isError }] =
    useRefreshScheduleMutation()

  const getStatusComponent = () => {
    if (isLoading) {
      return <span className={style.loader}></span>
    }
    if (isSuccess) {
      return <img src={successSVG} className={style.icon} alt="Успех" />
    }
    if (isError) {
      return <img src={failureSVG} className={style.icon} alt="Ошибка" />
    }
    return <>Отправить</>
  }
  return (
    <div className={style.container}>
      <h1 className={style.heading}>Обновить расписание</h1>

      <form
        className={style.form}
        onSubmit={(e) => {
          e.preventDefault()

          if (!passwordValue) {
            return
          }
          refreshSchedule(passwordValue)
        }}
      >
        <label className={style.label}>
          <input
            placeholder="Введите пароль"
            className={`${style.input}`}
            type="text"
            value={passwordValue}
            onChange={(e) => setPasswordValue(e.target.value)}
          />
        </label>

        <button
          className={style.submitButton}
          type="submit"
          disabled={isLoading}
        >
          {getStatusComponent()}
        </button>
      </form>
    </div>
  )
}
