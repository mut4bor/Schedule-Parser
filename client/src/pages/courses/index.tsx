import * as style from './style.module.scss'
import { Courses } from '@/entities/courses'
import { Groups } from '@/entities/groups'
import { useState } from 'react'
export const CoursesPage = () => {
  const [coursesSkeletonIsEnabled, setCoursesSkeletonIsEnabled] = useState(true)

  const handleStateChange = (newState: boolean) => {
    setCoursesSkeletonIsEnabled(newState)
  }

  return (
    <div className={style.container}>
      <div className={style.wrapper}>
        <Courses handleStateChange={handleStateChange} />
        <Groups handleStateChange={handleStateChange} skeletonState={coursesSkeletonIsEnabled} />
      </div>
    </div>
  )
}
