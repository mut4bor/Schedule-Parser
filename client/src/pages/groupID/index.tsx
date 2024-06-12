import * as style from './style.module.scss'
import { useParams } from 'react-router-dom'
import { WeeksList } from '@/widgets/weeks-list'
import { DaysList } from '@/widgets/days-list'
import { Schedule } from '@/widgets/schedule'
import {
  educationTypeChanged,
  facultyChanged,
  courseChanged,
  groupIDChanged,
  useAppDispatch,
  useGetGroupByIDQuery,
  useAppSelector,
  useGetWeekScheduleByIDQuery,
} from '@/shared/redux'
import { useState, useEffect } from 'react'
import { useSwipeable } from 'react-swipeable'
import { RefreshDate } from '@/widgets/refresh-date'
import { GroupHeading } from '@/entities/group'
import { Options } from '@/widgets/options'

export const GroupIDPage = () => {
  const dispatch = useAppDispatch()
  const { groupID } = useParams()

  const navigationValue = useAppSelector((store) => store.navigation.navigationValue)
  const { week: pickedWeek } = navigationValue

  const [isGroupDaysVisible, setIsGroupDaysVisible] = useState(true)

  if (!groupID) {
    return <div className={style.error}>Invalid Group ID</div>
  }

  const { data: groupData, error: groupError } = useGetGroupByIDQuery(groupID, {
    skip: !groupID,
  })

  const { data: scheduleData, error: scheduleError } = useGetWeekScheduleByIDQuery(
    {
      groupID: groupID,
      week: pickedWeek,
    },
    {
      skip: !groupID || !pickedWeek,
    },
  )

  useEffect(() => {
    if (!!groupID) {
      dispatch(groupIDChanged(groupID))
    }
  }, [groupID, dispatch])

  useEffect(() => {
    if (!!groupData) {
      const { educationType, faculty, course } = groupData
      dispatch(educationTypeChanged(educationType))
      dispatch(facultyChanged(faculty))
      dispatch(courseChanged(course))
    }
  }, [groupData, dispatch, groupID])

  const contentSwipeHandler = useSwipeable({
    onSwipedLeft: () => setIsGroupDaysVisible(false),
    onSwipedRight: () => setIsGroupDaysVisible(true),
    preventScrollOnSwipe: true,
  })

  const scheduleTapHandler = useSwipeable({
    onTap: () => setIsGroupDaysVisible(false),
  })

  return (
    <div className={style.container}>
      <WeeksList groupID={groupID} />
      <div className={style.content} {...contentSwipeHandler}>
        <div className={style.wrapper}>
          <DaysList
            scheduleData={scheduleData}
            toggleIsGroupDaysVisible={() => setIsGroupDaysVisible((prevState) => !prevState)}
            isGroupDaysVisible={isGroupDaysVisible}
          />
          <div className={style.schedule} {...scheduleTapHandler}>
            <div className={style.headingContainer}>
              <GroupHeading groupData={groupData} />
              <Options groupID={groupID} />
            </div>
            <Schedule scheduleData={scheduleData} />
            <RefreshDate groupData={groupData} />
          </div>
        </div>
      </div>
    </div>
  )
}
