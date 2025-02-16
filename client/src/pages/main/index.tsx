import * as style from './style.module.scss'
import { Faculty } from '@/widgets/faculty'
import { useGetFacultiesQuery } from '@/shared/redux'
import { ErrorComponent } from '@/widgets/error'

export const MainPage = () => {
  const {
    data: facultiesData,
    error: facultiesError,
    isLoading,
    isFetching,
  } = useGetFacultiesQuery()

  if (facultiesError) {
    return <ErrorComponent error={facultiesError} hideMainPageButton />
  }

  return (
    <div className={style.container}>
      {!facultiesData || isLoading || isFetching
        ? Array.from({ length: 3 }).map((_, index) => (
            <Faculty columnsAmount={4 - index} key={index} />
          ))
        : Object.entries(facultiesData).map(
            ([educationType, faculties], key) => (
              <Faculty data={{ educationType, faculties }} key={key} />
            ),
          )}
    </div>
  )
}
