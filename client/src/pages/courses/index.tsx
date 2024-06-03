import * as style from './style.module.scss'
import { useAppDispatch, useAppSelector, routerValueChanged, useGetCoursesQuery } from '@/shared/redux'
import { Link, useNavigate } from 'react-router-dom'
import { FACULTIES_PATH, GROUPS_PATH } from '@/shared/config'

export const CoursesPage = () => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const routerValue = useAppSelector((store) => store.router.routerValue)
  const { educationType, faculty } = routerValue

  if (!faculty) {
    navigate(FACULTIES_PATH)
  }

  const searchParams = new URLSearchParams({
    educationType: educationType,
    faculty: faculty,
  }).toString()
  const { data, error } = useGetCoursesQuery(searchParams)

  if (!data) return <div className=""></div>

  return (
    <div className={style.container}>
      {data.map((item, key) => (
        <Link
          to={GROUPS_PATH}
          onClick={() => {
            dispatch(routerValueChanged({ ...routerValue, course: item }))
          }}
          className={style.link}
          key={key}
        >
          {item}
        </Link>
      ))}
    </div>
  )
}
