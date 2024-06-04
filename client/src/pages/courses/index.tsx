import * as style from './style.module.scss'
import { Courses } from '@/entities/courses'
import { Groups } from '@/entities/group'

export const CoursesPage = () => {
  return (
    <div className={style.container}>
      <div className={style.wrapper}>
        <Courses />
        <Groups />
      </div>
    </div>
  )
}
