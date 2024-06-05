import * as style from './style.module.scss'
import { Faculty } from '@/entities/faculty'
import { useGetFacultiesQuery } from '@/shared/redux'
import React, { useState, useEffect } from 'react'

export const MainPage = () => {
  const { data: facultiesData, error: facultiesError, isLoading, isFetching } = useGetFacultiesQuery()

  const isSkeleton = isLoading || isFetching

  const [showSkeleton, setShowSkeleton] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSkeleton(false)
    }, 300)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className={style.container}>
      {!facultiesData || isSkeleton || showSkeleton
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
