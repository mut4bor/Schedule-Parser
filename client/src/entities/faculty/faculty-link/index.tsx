import * as style from './style.module.scss'
import { FacultyLinkProps } from './types'
import { Link } from 'react-router-dom'
import { useAppDispatch, useAppSelector, routerValueChanged } from '@/shared/redux'
import { COURSES_PATH } from '@/shared/config'

export const FacultyLink = (props: FacultyLinkProps) => {
  const dispatch = useAppDispatch()
  const routerValue = useAppSelector((store) => store.router.routerValue)

  const {
    data: { educationType, faculty },
  } = props

  const splittedFaculty = faculty.toString().split(',')

  return (
    <Link
      className={style.link}
      to={COURSES_PATH}
      onClick={() => {
        dispatch(
          routerValueChanged({
            ...routerValue,
            educationType: educationType,
            faculty: faculty,
          }),
        )
      }}
    >
      <ul className={style.list}>
        {splittedFaculty.map((item, key) => (
          <li className={style.listElement} key={key}>
            {item}
          </li>
        ))}
      </ul>
    </Link>
  )
}
