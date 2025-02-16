import * as style from './style.module.scss'
import { Skeleton } from '@/shared/ui'
import { Link } from 'react-router-dom'
import { useAppSelector, useGetNamesQuery } from '@/shared/redux'

export const GroupsList = () => {
  const navigationValue = useAppSelector(
    (store) => store.navigation.navigationValue,
  )
  const { educationType, faculty, course } = navigationValue
  const favoriteGroup = localStorage.getItem('favorite-group')

  const namesSearchParams = new URLSearchParams({
    educationType: educationType,
    faculty: faculty,
    course: course,
  }).toString()

  const { data: namesData, error: namesError } =
    useGetNamesQuery(namesSearchParams)

  return (
    <div className={style.container}>
      <div className={style.main}>
        {!namesData
          ? Array.from({ length: 16 }).map((_, index) => (
              <Skeleton className={style.skeleton} key={index} />
            ))
          : namesData.map((item, index) => (
              <Link
                to={`/groupID/${item._id}`}
                className={`${style.link} ${favoriteGroup === item._id ? style.active : null}`}
                key={index}
              >
                <p className={style.text}>{item.group}</p>
              </Link>
            ))}
      </div>
    </div>
  )
}
