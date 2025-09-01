import * as style from './style.module.scss'
import { useParams } from 'react-router-dom'
import { WeeksList } from '@/widgets/weeks-list'
import { DaysList } from '@/widgets/days-list'
import { Schedule } from '@/widgets/schedule'
import {
  useGetGroupByIDQuery,
  useGetWeekScheduleByIDQuery,
  useUpdateGroupByIDMutation,
} from '@/shared/redux'
import { useState, useEffect } from 'react'
import { useSwipeable } from 'react-swipeable'
import { RefreshDate } from '@/widgets/refresh-date'
import { GroupHeading } from '@/entities/group'
import { ErrorComponent } from '@/widgets/error'
import { Options } from '@/widgets/options'
import { createTapStopPropagationHandler, getTodayIndex } from '@/shared/hooks'
import { EditableItem } from '@/widgets/editable-item'

const { dayWeekIndex } = getTodayIndex()

enum DayIndex {
  None = -1,
  Monday = 0,
  Tuesday = 1,
  Wednesday = 2,
  Thursday = 3,
  Friday = 4,
  Saturday = 5,
  Sunday = 6,
}

export const GroupIDPage = () => {
  const { groupID: paramsGroupID } = useParams()
  const groupID = paramsGroupID ?? ''

  const [pickedWeek, setPickedWeek] = useState<string | null>(null)
  const [pickedDayIndex, setPickedDayIndex] = useState<DayIndex>(DayIndex.None)

  const [isGroupDaysVisible, setIsGroupDaysVisible] = useState(false)
  const [isOptionsListVisible, setIsOptionsListVisible] = useState(false)

  const hideGroupDays = () => setIsGroupDaysVisible(false)
  const showGroupDays = () => setIsGroupDaysVisible(true)
  const toggleGroupDays = () => setIsGroupDaysVisible((prev) => !prev)

  const hideOptionsList = () => setIsOptionsListVisible(false)
  const toggleOptionsList = () => setIsOptionsListVisible((prev) => !prev)

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

  const { data: groupData } = useGetGroupByIDQuery(groupID, {
    skip: !groupID,
  })

  const { data: scheduleData } = useGetWeekScheduleByIDQuery(
    {
      groupID: groupID,
      week: pickedWeek ?? '',
    },
    {
      skip: !groupID || !pickedWeek,
    },
  )

  const [updateGroup] = useUpdateGroupByIDMutation()

  useEffect(() => {
    setPickedDayIndex(dayWeekIndex)

    return () => {
      setPickedDayIndex(DayIndex.None)
      setPickedWeek(null)
    }
  }, [groupID])

  if (!groupID) {
    return (
      <ErrorComponent
        error={{
          status: 500,
          data: { message: 'Invalid groupID' },
        }}
      />
    )
  }

  return (
    <div className={style.container}>
      <WeeksList pickedWeek={pickedWeek} setPickedWeek={setPickedWeek} />
      <div className={style.content} {...contentSwipeHandler}>
        <div className={style.wrapper}>
          <DaysList
            pickedDayIndex={pickedDayIndex}
            pickedWeek={pickedWeek}
            setPickedDayIndex={setPickedDayIndex}
            scheduleData={scheduleData}
            toggleIsGroupDaysVisible={toggleGroupDays}
            isGroupDaysVisible={isGroupDaysVisible}
            {...daysListStopPropagationHandler}
          />
          <div className={style.schedule}>
            <div className={style.headingContainer}>
              <div>
                <EditableItem
                  value={groupData?.group ?? ''}
                  crudHandlers={{
                    onUpdate: async (_, newValue) => {
                      if (!groupID) return
                      await updateGroup({
                        id: groupID,
                        data: { group: newValue },
                      }).unwrap()
                    },
                  }}
                >
                  <GroupHeading>{groupData?.group}</GroupHeading>
                </EditableItem>
              </div>

              <Options
                groupID={groupID}
                isOptionsListVisible={isOptionsListVisible}
                toggleOptionsList={toggleOptionsList}
                {...optionsStopPropagationHandler}
              />
            </div>
            <Schedule
              scheduleData={scheduleData}
              groupID={groupID}
              pickedDayIndex={pickedDayIndex}
              pickedWeek={pickedWeek}
            />
            <RefreshDate date={groupData?.updatedAt} />
          </div>
        </div>
      </div>
    </div>
  )
}
