import { useState, useEffect } from 'react'
import * as style from './style.module.scss'
import { SkeletonParagraph } from '@/shared/ui'
import { Link } from 'react-router-dom'
import { useAppSelector, useGetNamesQuery } from '@/shared/redux'

export const Groups = () => {
  const routerValue = useAppSelector((store) => store.router.routerValue)
  const { educationType, faculty, course } = routerValue

  const namesSearchParams = new URLSearchParams({
    educationType: educationType,
    faculty: faculty,
    course: course,
  }).toString()

  const { data: namesData, error: namesError, isLoading, isFetching } = useGetNamesQuery(namesSearchParams)

  const [showSkeleton, setShowSkeleton] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSkeleton(false)
    }, 300)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className={style.container}>
      <div className={style.main}>
        {!namesData || isLoading || isFetching || showSkeleton
          ? Array.from({ length: 12 }).map((item, key) => (
              <SkeletonParagraph style={{ height: '3.6rem', borderRadius: '2rem' }} key={key} />
            ))
          : [...namesData]
              .sort((a, b) => a.index - b.index)
              .map((item, key) => (
                <Link to={`/${item._id}`} className={style.link} key={key}>
                  <p className={style.text}>{item.group}</p>
                </Link>
              ))}
      </div>
    </div>
  )
}
