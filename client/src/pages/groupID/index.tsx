import * as style from './style.module.scss'
import { useParams } from 'react-router-dom'
import { GroupSlider } from '@/entities/group/group-slider'
import { GroupDays } from '@/entities/group/group-days'
import { GroupSchedule } from '@/entities/group/group-schedule'
import {
  educationTypeChanged,
  facultyChanged,
  courseChanged,
  groupChanged,
  useAppDispatch,
  useGetGroupByIDQuery,
} from '@/shared/redux'
import { SetStateAction, useEffect, useState } from 'react'

export const GroupIDPage = () => {
  const dispatch = useAppDispatch()
  const { groupID } = useParams()

  useEffect(() => {
    if (!!groupID) {
      dispatch(groupChanged(groupID))
    }
  }, [groupID, dispatch])

  if (!groupID) {
    return <div className={style.error}>Invalid Group ID</div>
  }

  const { data: groupData, error: groupError, isLoading, isFetching } = useGetGroupByIDQuery(groupID)

  useEffect(() => {
    if (!!groupData) {
      const { educationType, faculty, course } = groupData
      dispatch(educationTypeChanged(educationType))
      dispatch(facultyChanged(faculty))
      dispatch(courseChanged(course))
    }
  }, [groupData, dispatch, groupID])

  const [touchStartX, setTouchStartX] = useState(0)
  const [touchEndX, setTouchEndX] = useState(0)
  const [isGroupDaysVisible, setIsGroupDaysVisible] = useState(true)

  const handleTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
    setTouchStartX(event.targetTouches[0].clientX)
  }

  const handleTouchMove = (event: React.TouchEvent<HTMLDivElement>) => {
    setTouchEndX(event.targetTouches[0].clientX)
  }

  const handleTouchEnd = () => {
    if (touchStartX - touchEndX > 50) {
      return setIsGroupDaysVisible(false)
    }

    if (touchStartX - touchEndX < -50) {
      return setIsGroupDaysVisible(true)
    }
  }
  const handleState = (state: boolean) => {
    setIsGroupDaysVisible(state)
  }

  return (
    <div className={style.container}>
      <GroupSlider data={groupData} />
      <div
        className={style.wrapper}
        // onTouchStart={handleTouchStart}
        // onTouchMove={handleTouchMove}
        // onTouchEnd={handleTouchEnd}
      >
        <GroupDays data={groupData} handleState={handleState} state={isGroupDaysVisible} />
        <div className={style.schedule}>
          <GroupSchedule data={groupData} />
        </div>
      </div>
    </div>
  )
}
