import * as style from './style.module.scss'
import { NavigationButton } from '@/entities/navigation-button'
import { Courses } from '@/entities/courses'
import { Groups } from '@/entities/groups'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
export const CoursesPage = () => {
  const navigate = useNavigate()
  const [coursesSkeletonIsEnabled, setCoursesSkeletonIsEnabled] = useState(true)

  const handleSkeletonStateChange = (newState: boolean) => {
    setCoursesSkeletonIsEnabled(newState)
  }

  return (
    <div className={style.container}>
      <div className="">
        <NavigationButton text={'Назад'} onClick={() => navigate('/')} />
      </div>
      <div className={style.wrapper}>
        <Courses handleSkeletonStateChange={handleSkeletonStateChange} />
        <Groups handleSkeletonStateChange={handleSkeletonStateChange} skeletonState={coursesSkeletonIsEnabled} />
      </div>
    </div>
  )
}
