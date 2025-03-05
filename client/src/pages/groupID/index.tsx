import * as style from './style.module.scss'
import { useParams } from 'react-router-dom'
import { WeeksList } from '@/widgets/weeks-list'
import { DaysList } from '@/widgets/days-list'
import { Schedule } from '@/widgets/schedule'
import {
  educationTypeChanged,
  facultyChanged,
  courseChanged,
  useAppDispatch,
  useGetGroupByIDQuery,
  useAppSelector,
  useGetWeekScheduleByIDQuery,
  dayIndexChanged,
  weekChanged,
} from '@/shared/redux'
import { useState, useEffect } from 'react'
import { useSwipeable } from 'react-swipeable'
import { RefreshDate } from '@/widgets/refresh-date'
import { GroupHeading } from '@/entities/group'
import { ErrorComponent } from '@/widgets/error'
import { Options } from '@/widgets/options'
import { createTapStopPropagationHandler, getDayToPick } from '@/shared/hooks'

const { dayWeekIndex } = getDayToPick()

export const GroupIDPage = () => {
  const dispatch = useAppDispatch()
  const { groupID: paramsGroupID } = useParams()

  const groupID = paramsGroupID ?? ''

  const pickedWeek = useAppSelector((store) => store.navigation.week)

  const [isGroupDaysVisible, setIsGroupDaysVisible] = useState(false)
  const [isOptionsListVisible, setIsOptionsListVisible] = useState(false)

  const hideGroupDays = () => setIsGroupDaysVisible(false)
  const showGroupDays = () => setIsGroupDaysVisible(true)
  const toggleGroupDays = () => setIsGroupDaysVisible((prevState) => !prevState)

  const hideOptionsList = () => setIsOptionsListVisible(false)
  const toggleOptionsList = () =>
    setIsOptionsListVisible((prevState) => !prevState)

  const contentSwipeHandler = useSwipeable({
    onSwipedLeft: hideGroupDays,
    onSwipedRight: showGroupDays,
    onTap: () => {
      hideGroupDays()
      hideOptionsList()
    },
    preventScrollOnSwipe: true,
  })

  const daysListStopPropagationHandler = createTapStopPropagationHandler()
  const optionsStopPropagationHandler = createTapStopPropagationHandler()

  const { data: groupData, error: groupError } = useGetGroupByIDQuery(groupID, {
    skip: !groupID,
  })

  const { data: scheduleData, error: scheduleError } =
    useGetWeekScheduleByIDQuery(
      {
        groupID: groupID,
        week: pickedWeek ?? '',
      },
      {
        skip: !groupID || !pickedWeek,
      },
    )

  useEffect(() => {
    if (groupData) {
      dispatch(educationTypeChanged(groupData.educationType))
      dispatch(facultyChanged(groupData.faculty))
      dispatch(courseChanged(groupData.course))
    }
  }, [dispatch, groupID, groupData])

  useEffect(() => {
    dispatch(dayIndexChanged(dayWeekIndex))

    return () => {
      dispatch(dayIndexChanged(-1))
      dispatch(weekChanged(null))
    }
  }, [groupID])

  if (!groupID) {
    return (
      <ErrorComponent
        error={{
          status: 500,
          data: {
            message: 'Invalid groupID',
          },
        }}
      />
    )
  }

  if (groupError) {
    return <ErrorComponent error={groupError} />
  }

  if (scheduleError) {
    return <ErrorComponent error={scheduleError} />
  }

  return (
    <div className={style.container}>
      <WeeksList />
      <div className={style.content} {...contentSwipeHandler}>
        <div className={style.wrapper}>
          <DaysList
            scheduleData={scheduleData}
            toggleIsGroupDaysVisible={toggleGroupDays}
            isGroupDaysVisible={isGroupDaysVisible}
            {...daysListStopPropagationHandler}
          />
          <div className={style.schedule}>
            <div className={style.headingContainer}>
              <GroupHeading text={groupData?.group} />

              <Options
                groupID={groupID}
                isOptionsListVisible={isOptionsListVisible}
                toggleOptionsList={toggleOptionsList}
                {...optionsStopPropagationHandler}
              />
            </div>
            <Schedule scheduleData={scheduleData} />
            <RefreshDate date={groupData?.updatedAt} />
          </div>
        </div>
      </div>
    </div>
  )
}
