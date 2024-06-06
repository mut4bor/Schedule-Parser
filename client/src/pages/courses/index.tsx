import * as style from './style.module.scss'
import { NavigationButton } from '@/entities/navigation-button'
import { Courses } from '@/entities/courses'
import { Groups } from '@/entities/groups'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
export const CoursesPage = () => {
  const navigate = useNavigate()
  const [coursesSkeletonIsEnabled, setCoursesSkeletonIsEnabled] = useState(true)

  const handleStateChange = (newState: boolean) => {
    setCoursesSkeletonIsEnabled(newState)
  }

  return (
    <div className={style.container}>
      <div className="">
        <NavigationButton text={'Назад'} onClick={() => navigate('/')} />
      </div>
      <div className={style.wrapper}>
        <Courses handleStateChange={handleStateChange} />
        <Groups handleStateChange={handleStateChange} skeletonState={coursesSkeletonIsEnabled} />
      </div>
    </div>
  )
}
