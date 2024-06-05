import * as style from './style.module.scss'
import { Faculty } from '@/entities/faculty'
import { useGetFacultiesQuery } from '@/shared/redux'
import React from 'react'

export const MainPage = () => {
  const { data: facultiesData, error: facultiesError, isLoading, isFetching } = useGetFacultiesQuery()

  const isSkeleton = isLoading || isFetching

  return (
    <div className={style.container}>
      {!facultiesData || isSkeleton
        ? Array.from({ length: 3 }).map((_, index) => (
            <React.Fragment key={`faculty-${index}`}>
              <Faculty key={index} />
            </React.Fragment>
          ))
        : Object.entries(facultiesData).map(([educationType, faculties], key) => {
            return (
              <React.Fragment key={`faculty-${key}`}>
                <Faculty data={{ educationType, faculties }} key={key} />
              </React.Fragment>
            )
          })}
    </div>
  )
}
