import { ErrorComponent } from '@/widgets/error'

export const ErrorPage = () => {
  return (
    <ErrorComponent
      error={{
        status: 404,
        data: {
          message: 'Страница не найдена',
        },
      }}
    />
  )
}
