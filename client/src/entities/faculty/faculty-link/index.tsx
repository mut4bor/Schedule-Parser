import * as style from './style.module.scss'
import { FacultyLinkProps } from './types'
import { SkeletonParagraph } from '@/shared/ui'
import { Link } from 'react-router-dom'
import { useAppDispatch, useAppSelector, navigationValueChanged } from '@/shared/redux'
import { COURSES_PATH } from '@/shared/config'

export const FacultyLink = ({ data }: FacultyLinkProps) => {
  const dispatch = useAppDispatch()
  const navigationValue = useAppSelector((store) => store.navigation.navigationValue)

  if (!data) {
    return (
      <div className={style.skeleton}>
        <ul className={style.list}>
          {Array.from({ length: 5 }).map((_, index) => (
            <li key={index}>
              <SkeletonParagraph />
            </li>
          ))}
        </ul>
      </div>
    )
  }

  const { educationType, faculty } = data

  const handleLinkClick = () => {
    dispatch(navigationValueChanged({ ...navigationValue, educationType, faculty, course: '', week: '', dayIndex: -1 }))
  }

  return (
    <Link className={style.link} to={COURSES_PATH} onClick={handleLinkClick}>
      <ul className={style.list}>
        {faculty
          .toString()
          .split(',')
          .map((item) => (
            <li className={style.listElement} key={item}>
              {item}
            </li>
          ))}
      </ul>
    </Link>
  )
}
