import * as style from './style.module.scss'
import { useLoginMutation, useRegisterMutation } from '@/shared/redux/slices/api/authApi'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

type AuthMode = 'login' | 'register'

export const LoginPage = () => {
  const [
    registerUser,
    {
      data: registerData,
      error: registerError,
      isLoading: registerIsLoading,
      isSuccess: registerIsSuccess,
    },
  ] = useRegisterMutation()

  const [
    login,
    { data: loginData, error: loginError, isLoading: loginIsLoading, isSuccess: loginIsSuccess },
  ] = useLoginMutation()

  const [mode, setMode] = useState<AuthMode>('login')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showSuccess, setShowSuccess] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (mode === 'login') {
      await login({ username, password })
    } else {
      await registerUser({ username, password })
    }
  }

  useEffect(() => {
    if (loginIsSuccess || registerIsSuccess) {
      setShowSuccess(true)
      const timer = setTimeout(() => {
        setShowSuccess(false)
        navigate('/')
      }, 1200)
      return () => clearTimeout(timer)
    }
  }, [loginIsSuccess, registerIsSuccess, navigate])

  const isLoading = loginIsLoading || registerIsLoading
  const error = mode === 'login' ? loginError : registerError

  return (
    <div className={style.container}>
      <form className={style.form} onSubmit={handleSubmit}>
        <h2 className={style.title}>{mode === 'login' ? 'Вход' : 'Регистрация'}</h2>

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
            autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
            required
          />
        </div>

        <button className={style.submitButton} type="submit" disabled={isLoading}>
          {isLoading ? 'Загрузка...' : mode === 'login' ? 'Войти' : 'Зарегистрироваться'}
        </button>

        <button
          className={style.switchButton}
          type="button"
          onClick={() => setMode((prev) => (prev === 'login' ? 'register' : 'login'))}
        >
          {mode === 'login' ? 'Нет аккаунта? Зарегистрироваться' : 'Уже есть аккаунт? Войти'}
        </button>

        {error && <div className={style.errorMessage}>Произошла ошибка, попробуйте ещё раз</div>}

        {showSuccess && (
          <div className={style.errorMessage} style={{ color: 'limegreen' }}>
            {mode === 'login'
              ? 'Успешный вход! Перенаправление...'
              : 'Успешная регистрация! Перенаправление...'}
          </div>
        )}
      </form>
    </div>
  )
}
