import * as style from './style.module.scss'
import { useGetFacultiesQuery } from '@/shared/redux'
import { Link, useParams } from 'react-router-dom'

export const FacultiesPage = () => {
  const { educationType } = useParams()
  if (!educationType) {
    return <div className=""></div>
  }
  const searchParams = new URLSearchParams({
    educationType: educationType,
  }).toString()
  const { data, error } = useGetFacultiesQuery(searchParams)

  if (!data) return <div className=""></div>

  return (
    <div className={style.container}>
      {data.map((item, key) => {
        return (
          <Link to={`/${educationType}/${item}`} className={style.link} key={key}>
            {item}
          </Link>
        )
      })}
    </div>
  )
}
