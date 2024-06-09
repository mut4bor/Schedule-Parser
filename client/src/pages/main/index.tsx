import * as style from './style.module.scss'
import { Faculty } from '@/widgets/faculty'
import { useState, useEffect } from 'react'
import { useGetFacultiesQuery } from '@/shared/redux'
import { SkeletonTime } from '@/shared/vars/vars'

export const MainPage = () => {
  const { data: facultiesData, error: facultiesError, isLoading, isFetching } = useGetFacultiesQuery()

  const [skeletonIsEnabled, setSkeletonIsEnabled] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setSkeletonIsEnabled(false)
    }, SkeletonTime)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className={style.container}>
      {!facultiesData || isLoading || isFetching || skeletonIsEnabled
        ? Array.from({ length: 3 }).map((_, index) => <Faculty key={index} columnsAmount={4 - index} />)
        : Object.entries(facultiesData).map(([educationType, faculties], key) => (
            <Faculty data={{ educationType, faculties }} key={key} />
          ))}
    </div>
  )
}
