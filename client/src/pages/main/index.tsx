import * as style from './style.module.scss'
import { Faculty } from '@/widgets/faculty'
import { useState, useEffect } from 'react'
import { useGetFacultiesQuery } from '@/shared/redux'
import { SkeletonTime } from '@/shared/vars/vars'

export const MainPage = () => {
  const {
    data: facultiesData,
    error: facultiesError,
    isLoading,
    isFetching,
  } = useGetFacultiesQuery()

  const [mainPageSkeletonIsEnabled, setMainPageSkeletonIsEnabled] =
    useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setMainPageSkeletonIsEnabled(false)
    }, SkeletonTime)
    return () => clearTimeout(timer)
  }, [facultiesData])

  return (
    <div className={style.container}>
      {!facultiesData || isLoading || isFetching || mainPageSkeletonIsEnabled
        ? Array.from({ length: 3 }).map((_, index) => (
            <Faculty key={index} columnsAmount={4 - index} />
          ))
        : Object.entries(facultiesData).map(
            ([educationType, faculties], key) => (
              <Faculty data={{ educationType, faculties }} key={key} />
            ),
          )}
    </div>
  )
}
