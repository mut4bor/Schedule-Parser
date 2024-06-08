import * as style from './style.module.scss'
import { useParams } from 'react-router-dom'
import { GroupWeeksSlider } from '@/entities/group/group-weeks-slider'
import { GroupDays } from '@/entities/group/group-days'
import { GroupSchedule } from '@/entities/group/group-schedule'
import {
  educationTypeChanged,
  facultyChanged,
  courseChanged,
  groupIDChanged,
  useAppDispatch,
  useGetGroupByIDQuery,
} from '@/shared/redux'
import { useState, useEffect } from 'react'
import { useSwipeable } from 'react-swipeable'

export const GroupIDPage = () => {
  const dispatch = useAppDispatch()
  const { groupID } = useParams()
  const [isGroupDaysVisible, setIsGroupDaysVisible] = useState(true)

  useEffect(() => {
    if (!!groupID) {
      dispatch(groupIDChanged(groupID))
    }
  }, [groupID, dispatch])

  if (!groupID) {
    return <div className={style.error}>Invalid Group ID</div>
  }

  const {
    data: groupData,
    error: groupError,
    isLoading,
    isFetching,
  } = useGetGroupByIDQuery(groupID, {
    skip: !groupID,
  })

  useEffect(() => {
    if (!!groupData) {
      const { educationType, faculty, course } = groupData
      dispatch(educationTypeChanged(educationType))
      dispatch(facultyChanged(faculty))
      dispatch(courseChanged(course))
    }
  }, [groupData, dispatch, groupID])

  const handlers = useSwipeable({
    onSwipedLeft: () => setIsGroupDaysVisible(false),
    onSwipedRight: () => setIsGroupDaysVisible(true),
    onTap: () => setIsGroupDaysVisible(false),
    preventScrollOnSwipe: true,
  })

  return (
    <div className={style.container}>
      <GroupWeeksSlider groupID={groupID} />
      <div className={style.wrapper}>
        <GroupDays
          groupID={groupID}
          handleSetIsGroupDaysVisible={(state: boolean) => setIsGroupDaysVisible(state)}
          isGroupDaysVisible={isGroupDaysVisible}
        />
        <div className={style.schedule} {...handlers}>
          <GroupSchedule groupID={groupID} groupName={groupData?.group} />
        </div>
      </div>
    </div>
  )
}
