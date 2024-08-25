import * as style from './style.module.scss'
import { ErrorComponentProps } from './types'
import { Link } from 'react-router-dom'
import { BASE_URL } from '@/shared/routes'

export const ErrorComponent = ({
  error,
  hideMainPageButton,
}: ErrorComponentProps) => {
  const { statusCode, errorMessage } = getErrorDetails(error)

  return (
    <div className={style.container}>
      <p className={style.text}>
        Ошибка {statusCode}: {errorMessage}
      </p>

      {!hideMainPageButton && (
        <Link className={style.link} to={BASE_URL}>
          Вернуться на главную
        </Link>
      )}
    </div>
  )
}

const getErrorDetails = (error: ErrorComponentProps['error']) => {
  if ('status' in error) {
    const statusCode = error.status
    if (typeof error.data === 'string') {
      return { statusCode, errorMessage: error.data }
    }

    if (
      error.data &&
      typeof error.data === 'object' &&
      'message' in error.data
    ) {
      return { statusCode, errorMessage: error.data.message as string }
    }

    return { statusCode, errorMessage: 'Произошла ошибка при запросе данных' }
  }

  if ('message' in error) {
    return {
      statusCode: undefined,
      errorMessage: error.message || 'Произошла неизвестная ошибка',
    }
  }

  return { statusCode: undefined, errorMessage: 'Произошла ошибка' }
}
