import * as style from './style.module.scss'
import { Skeleton } from '@/shared/ui'
import { Link, useParams } from 'react-router-dom'
import { useGetNamesQuery } from '@/shared/redux'

export const GroupsList = () => {
  const { educationType, faculty, course } = useParams()
  const favoriteGroup = localStorage.getItem('favorite-group')

  const namesSearchParams = new URLSearchParams({
    educationType: educationType ?? '',
    faculty: faculty ?? '',
    course: course ?? '',
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
                to={`groups/${item._id}`}
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
