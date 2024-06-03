import * as style from './style.module.scss'
import { FacultyListProps } from './types'
import { Link } from 'react-router-dom'
import { useAppDispatch, useAppSelector, routerValueChanged } from '@/shared/redux'
import { COURSES_PATH } from '@/shared/config'

export const FacultyList = (props: FacultyListProps) => {
  const dispatch = useAppDispatch()
  const routerValue = useAppSelector((store) => store.router.routerValue)
  const { data } = props
  const { educationType, faculties } = data
  return (
    <div className={style.list}>
      {faculties.map((faculty, key) => {
        const splittedFaculty = faculty.toString().split(',')
        return (
          <Link
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
            className={style.faculty}
            key={key}
          >
            {splittedFaculty.map((item, key) => (
              <p key={key}>{item}</p>
            ))}
          </Link>
        )
      })}
    </div>
  )
}
