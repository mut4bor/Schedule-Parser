import { ErrorComponent } from '@/widgets/error'
import { useRouteError } from 'react-router-dom'

export const ErrorPage = () => {
  const error = useRouteError() || {
    status: 500,
    data: {
      message: 'Произошла неизвестная ошибка',
    },
  }

  return <ErrorComponent error={error} />
}
