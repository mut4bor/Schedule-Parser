import * as style from './style.module.scss'
import { BackToPreviousLink } from '@/entities/navigation'
import { Courses } from '@/widgets/courses'
import { GroupsList } from '@/widgets/groups-list'
import routes from '@/shared/routes'

export const CoursesPage = () => {
  return (
    <div className={style.container}>
      <BackToPreviousLink href={routes.BASE_URL} />

      <div className={style.wrapper}>
        <Courses />
        <GroupsList />
      </div>
    </div>
  )
}
