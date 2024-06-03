import * as style from './style.module.scss'
import { useAppSelector, useGetNamesQuery } from '@/shared/redux'
import { Link, useNavigate } from 'react-router-dom'
import { COURSES_PATH } from '@/shared/config'

export const GroupsPage = () => {
  const navigate = useNavigate()
  const routerValue = useAppSelector((store) => store.router.routerValue)
  const { educationType, faculty, course } = routerValue

  if (!course) {
    navigate(COURSES_PATH)
  }

  const searchParams = new URLSearchParams({
    educationType: educationType,
    faculty: faculty,
    course: course,
  }).toString()

  const { data: namesData, error: namesError } = useGetNamesQuery(searchParams)

  if (!namesData) return <div className=""></div>

  const sortedNamesData = [...namesData].sort((a, b) => a.index - b.index)

  return (
    <div className={style.container}>
      <div className={style.main}>
        {sortedNamesData.map((item, key) => (
          <Link to={`/${item._id}`} className={style.link} key={key}>
            {item.group}
          </Link>
        ))}
      </div>
    </div>
  )
}
