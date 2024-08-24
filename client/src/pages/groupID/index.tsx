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
  useGetWeeksByIDQuery,
} from '@/shared/redux'
import { useState, useEffect } from 'react'
import { useSwipeable } from 'react-swipeable'
import { RefreshDate } from '@/widgets/refresh-date'
import { GroupHeading } from '@/entities/group'
import { ErrorComponent } from '@/widgets/error'
import { Options } from '@/widgets/options'

export const GroupIDPage = () => {
  const dispatch = useAppDispatch()
  const { groupID } = useParams()

  const { week: pickedWeek } = useAppSelector(
    (store) => store.navigation.navigationValue,
  )

  const [isGroupDaysVisible, setIsGroupDaysVisible] = useState(false)
  const [isOptionsListVisible, setIsOptionsListVisible] = useState(false)

  const hideGroupDays = () => setIsGroupDaysVisible(false)
  const showGroupDays = () => setIsGroupDaysVisible(true)
  const toggleGroupDays = () => setIsGroupDaysVisible((prevState) => !prevState)

  const hideOptionsList = () => setIsOptionsListVisible(false)
  const toggleOptionsList = () =>
    setIsOptionsListVisible((prevState) => !prevState)

  const tapStopPropagationHandler = () =>
    useSwipeable({
      onTap: (event) => {
        event.event.stopPropagation()
      },
    })

  const contentSwipeHandler = useSwipeable({
    onSwipedLeft: hideGroupDays,
    onSwipedRight: showGroupDays,
    onTap: () => {
      hideGroupDays()
      hideOptionsList()
    },
    preventScrollOnSwipe: true,
  })

  const { data: groupData, error: groupError } = useGetGroupByIDQuery(
    groupID ?? '',
    {
      skip: !groupID,
    },
  )

  const { data: weeksData, error: weeksError } = useGetWeeksByIDQuery(
    groupID ?? '',
    {
      skip: !groupID,
    },
  )

  const { data: scheduleData, error: scheduleError } =
    useGetWeekScheduleByIDQuery(
      {
        groupID: groupID ?? '',
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

  if (weeksError) {
    return <ErrorComponent error={weeksError} />
  }

  if (scheduleError) {
    return <ErrorComponent error={scheduleError} />
  }

  return (
    <div className={style.container}>
      <WeeksList weeksData={weeksData} />
      <div className={style.content} {...contentSwipeHandler}>
        <div className={style.wrapper}>
          <DaysList
            scheduleData={scheduleData}
            toggleIsGroupDaysVisible={toggleGroupDays}
            isGroupDaysVisible={isGroupDaysVisible}
            {...tapStopPropagationHandler()}
          />
          <div className={style.schedule}>
            <div className={style.headingContainer}>
              <GroupHeading groupData={groupData} />

              <Options
                groupID={groupID}
                isOptionsListVisible={isOptionsListVisible}
                toggleOptionsList={toggleOptionsList}
                {...tapStopPropagationHandler()}
              />
            </div>
            <Schedule scheduleData={scheduleData} />
            <RefreshDate groupData={groupData} />
          </div>
        </div>
      </div>
    </div>
  )
}
