import * as style from './style.module.scss'
import { useAppDispatch, useAppSelector, routerValueChanged, useGetFacultiesQuery } from '@/shared/redux'
import { Link, useNavigate } from 'react-router-dom'
import { BASE_URL, COURSES_PATH } from '@/shared/config'

export const FacultiesPage = () => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const routerValue = useAppSelector((store) => store.router.routerValue)
  const { educationType } = routerValue
  if (!educationType) {
    navigate(BASE_URL)
  }
  const searchParams = new URLSearchParams({
    educationType: educationType,
  }).toString()
  const { data, error } = useGetFacultiesQuery(searchParams)

  if (!data) return <div className=""></div>

  return (
    <div className={style.container}>
      {data.map((item, key) => (
        <Link
          to={COURSES_PATH}
          onClick={() => {
            dispatch(routerValueChanged({ ...routerValue, faculty: item.faculty }))
          }}
          className={style.link}
          key={key}
        >
          {item.faculty}
        </Link>
      ))}
    </div>
  )
}
