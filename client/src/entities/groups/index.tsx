import * as style from './style.module.scss'
import { GroupsProps } from './types'
import { SkeletonParagraph } from '@/shared/ui'
import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAppSelector, useGetNamesQuery } from '@/shared/redux'

export const Groups = ({ skeletonState, handleStateChange }: GroupsProps) => {
  const navigationValue = useAppSelector((store) => store.navigation.navigationValue)
  const { educationType, faculty, course } = navigationValue
  const { group: pickedGroup } = useAppSelector((store) => store.navigation.navigationValue)

  const namesSearchParams = new URLSearchParams({
    educationType: educationType,
    faculty: faculty,
    course: course,
  }).toString()

  const { data: namesData, error: namesError, isLoading, isFetching } = useGetNamesQuery(namesSearchParams)

  useEffect(() => {
    const timer = setTimeout(() => {
      handleStateChange(false)
    }, 300)
    return () => clearTimeout(timer)
  }, [skeletonState])

  return (
    <div className={style.container}>
      <div className={style.main}>
        {!namesData || isLoading || isFetching || skeletonState
          ? Array.from({ length: 12 }).map((item, key) => (
              <SkeletonParagraph style={{ height: '3.6rem', borderRadius: '2rem' }} key={key} />
            ))
          : [...namesData]
              .sort((a, b) => a.index - b.index)
              .map((item, key) => (
                <Link
                  to={`/${item._id}`}
                  className={`${style.link} ${pickedGroup === item._id ? style.active : ''}`}
                  key={key}
                >
                  <p className={style.text}>{item.group}</p>
                </Link>
              ))}
      </div>
    </div>
  )
}
