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

export const GroupIDPage = () => {
  const dispatch = useAppDispatch()
  const { groupID } = useParams()

  const navigationValue = useAppSelector((store) => store.navigation.navigationValue)
  const { week: pickedWeek } = navigationValue

  const [isGroupDaysVisible, setIsGroupDaysVisible] = useState(true)
  const [isOptionsListVisible, setIsOptionsListVisible] = useState(false)

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

  const createTapStopPropagationHandler = () =>
    useSwipeable({
      onTap: (event) => {
        event.event.stopPropagation()
      },
    })

  const daysListTapHandler = createTapStopPropagationHandler()
  const optionsListTapHandler = createTapStopPropagationHandler()
  const optionsButtonTapHandler = createTapStopPropagationHandler()

  const contentSwipeHandler = useSwipeable({
    onSwipedLeft: () => setIsGroupDaysVisible(false),
    onSwipedRight: () => setIsGroupDaysVisible(true),
    onTap: () => {
      setIsGroupDaysVisible(false)
      setIsOptionsListVisible(false)
    },
    preventScrollOnSwipe: true,
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
            {...daysListTapHandler}
          />
          <div className={style.schedule}>
            <div className={style.headingContainer}>
              <GroupHeading groupData={groupData} />
              <div className={style.options}>
                <OptionsList
                  groupID={groupID}
                  toggleIsOptionsListVisible={() => setIsOptionsListVisible((prevState) => !prevState)}
                  isOptionsListVisible={isOptionsListVisible}
                  {...optionsListTapHandler}
                />
                <OptionsButton
                  toggleIsOptionsListVisible={() => setIsOptionsListVisible((prevState) => !prevState)}
                  isOptionsListVisible={isOptionsListVisible}
                  {...optionsButtonTapHandler}
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
