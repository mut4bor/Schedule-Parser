import * as style from './style.module.scss'
import { useLoginMutation } from '@/shared/redux'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export const LoginPage = () => {
  const [login, { data: loginData, error, isLoading, isSuccess }] =
    useLoginMutation()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showSuccess, setShowSuccess] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await login({ username, password })
  }

  useEffect(() => {
    if (isSuccess) {
      setShowSuccess(true)
      const timer = setTimeout(() => {
        setShowSuccess(false)
        navigate('/')
      }, 1200)
      return () => clearTimeout(timer)
    }
  }, [isSuccess, navigate])

  return (
    <div className={style.container}>
      <form className={style.form} onSubmit={handleSubmit}>
        <div className={style.formGroup}>
          <label className={style.label} htmlFor="username">
            Логин:
          </label>
          <input
            className={style.input}
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
            required
          />
        </div>
        <div className={style.formGroup}>
          <label className={style.label} htmlFor="password">
            Пароль:
          </label>
          <input
            className={style.input}
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />
        </div>
        <button
          className={style.submitButton}
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? 'Загрузка...' : 'Войти'}
        </button>
        {error && <div className={style.errorMessage}>Произошла ошибка</div>}
        {showSuccess && (
          <div className={style.errorMessage} style={{ color: 'limegreen' }}>
            Успешный вход! Перенаправление...
          </div>
        )}
      </form>
    </div>
  )
}
