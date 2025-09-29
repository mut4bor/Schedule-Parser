import * as style from './style.module.scss'
import { Link } from 'react-router-dom'
import routes from '@/shared/routes'
import { SerializedError } from '@reduxjs/toolkit'
import { FetchBaseQueryError } from '@reduxjs/toolkit/query'

export interface Props {
  error: FetchBaseQueryError | SerializedError
  hideMainPageButton?: boolean
}

export const ErrorComponent = ({ error, hideMainPageButton }: Props) => {
  const { statusCode, errorMessage } = getErrorDetails(error)

  return (
    <div className={style.wrapper}>
      <div className={style.container}>
        <p className={style.text}>
          Ошибка {statusCode}: {errorMessage}
        </p>

        {!hideMainPageButton && (
          <Link className={style.link} to={routes.BASE_URL}>
            Вернуться на главную
          </Link>
        )}
      </div>
    </div>
  )
}

const getErrorDetails = (error: Props['error']) => {
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
