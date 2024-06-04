import * as style from './style.module.scss'
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

  const { data: namesData, error: namesError } = useGetNamesQuery(namesSearchParams)

  if (!namesData) return <div className=""></div>

  const sortedNamesData = [...namesData].sort((a, b) => a.index - b.index)

  return (
    <div className={style.container}>
      <div className={style.main}>
        {sortedNamesData.map((item, key) => (
          <Link to={`/${item._id}`} className={style.link} key={key}>
            <p className={style.text}>{item.group}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
