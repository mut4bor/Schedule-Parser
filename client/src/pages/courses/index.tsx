import * as style from './style.module.scss'
import { useGetCoursesQuery } from '@/shared/redux'
import { Link, useParams } from 'react-router-dom'

export const CoursesPage = () => {
  const { educationType, faculty } = useParams()

  if (!educationType || !faculty) {
    return <div className=""></div>
  }
  const searchParams = new URLSearchParams({
    educationType: educationType,
    faculty: faculty,
  }).toString()
  const { data, error } = useGetCoursesQuery(searchParams)

  if (!data) return <div className=""></div>

  return (
    <div className={style.container}>
      {data.map((item, key) => {
        return (
          <Link to={`/${educationType}/${faculty}/${item}`} className={style.link} key={key}>
            {item}
          </Link>
        )
      })}
    </div>
  )
}
