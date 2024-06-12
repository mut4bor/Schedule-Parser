import * as style from './style.module.scss'
import { BackToPreviousButton } from '@/entities/navigation'
import { Courses } from '@/widgets/courses'
import { GroupsList } from '@/widgets/groups-list'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
export const CoursesPage = () => {
  const navigate = useNavigate()
  const [groupsListSkeletonIsEnabled, setGroupsListSkeletonIsEnabled] = useState(true)

  const handleGroupsListSkeletonStateChange = (newState: boolean) => {
    setGroupsListSkeletonIsEnabled(newState)
  }

  return (
    <div className={style.container}>
      <div className="">
        <BackToPreviousButton onClick={() => navigate('/')} />
      </div>
      <div className={style.wrapper}>
        <Courses handleGroupsListSkeletonStateChange={handleGroupsListSkeletonStateChange} />
        <GroupsList
          handleGroupsListSkeletonStateChange={handleGroupsListSkeletonStateChange}
          skeletonState={groupsListSkeletonIsEnabled}
        />
      </div>
    </div>
  )
}
