import * as style from './style.module.scss'
import { useGetEducationTypesQuery } from '@/shared/redux'
import { Link } from 'react-router-dom'

export const EducationTypesPage = () => {
  const { data, error } = useGetEducationTypesQuery()

  if (!data) return <div className=""></div>

  return (
    <div className={style.container}>
      {data.map((item, key) => {
        return (
          <Link to={`/${item}`} className={style.link} key={key}>
            {item}
          </Link>
        )
      })}
    </div>
  )
}
