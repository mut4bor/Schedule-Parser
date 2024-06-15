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
import { OptionsList } from '@/widgets/options-list'
import { OptionsButton } from '@/entities/options'
import { createTapStopPropagationHandler } from '@/shared/hooks'

export const GroupIDPage = () => {
  const dispatch = useAppDispatch()
  const { groupID } = useParams()

  const navigationValue = useAppSelector((store) => store.navigation.navigationValue)
  const { week: pickedWeek } = navigationValue

  const [isGroupDaysVisible, setIsGroupDaysVisible] = useState(false)
  const [isOptionsListVisible, setIsOptionsListVisible] = useState(false)

  const hideGroupDays = () => setIsGroupDaysVisible(false)
  const showGroupDays = () => setIsGroupDaysVisible(true)
  const toggleGroupDays = () => setIsGroupDaysVisible((prevState) => !prevState)

  const hideOptionsList = () => setIsOptionsListVisible(false)
  const toggleOptionsList = () => setIsOptionsListVisible((prevState) => !prevState)

  const contentSwipeHandler = useSwipeable({
    onSwipedLeft: hideGroupDays,
    onSwipedRight: showGroupDays,
    onTap: () => {
      hideGroupDays()
      hideOptionsList()
    },
    preventScrollOnSwipe: true,
  })

  if (!groupID) {
    return <div>Invalid Group ID</div>
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

  return (
    <div className={style.container}>
      <WeeksList groupID={groupID} />
      <div className={style.content} {...contentSwipeHandler}>
        <div className={style.wrapper}>
          <DaysList
            scheduleData={scheduleData}
            toggleIsGroupDaysVisible={toggleGroupDays}
            isGroupDaysVisible={isGroupDaysVisible}
            {...createTapStopPropagationHandler()}
          />
          <div className={style.schedule}>
            <div className={style.headingContainer}>
              <GroupHeading groupData={groupData} />
              <div className={style.options}>
                <OptionsList groupID={groupID} isOptionsListVisible={isOptionsListVisible} />
                <OptionsButton
                  toggleIsOptionsListVisible={toggleOptionsList}
                  isOptionsListVisible={isOptionsListVisible}
                  {...createTapStopPropagationHandler()}
                />
              </div>
            </div>
            <Schedule scheduleData={scheduleData} />
            <RefreshDate groupData={groupData} />
          </div>
        </div>
      </div>
    </div>
  )
}
