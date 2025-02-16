import * as style from './style.module.scss'
import { BackToPreviousButton } from '@/entities/navigation'
import { Courses } from '@/widgets/courses'
import { GroupsList } from '@/widgets/groups-list'
import { useNavigate } from 'react-router-dom'
export const CoursesPage = () => {
  const navigate = useNavigate()

  return (
    <div className={style.container}>
      <BackToPreviousButton onClick={() => navigate('/')} />

      <div className={style.wrapper}>
        <Courses />
        <GroupsList />
      </div>
    </div>
  )
}
