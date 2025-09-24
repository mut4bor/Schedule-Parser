import * as style from './style.module.scss'
import { useNavigate, useParams } from 'react-router-dom'
import { WeeksList } from '@/widgets/weeks-list'
import { Sibebar } from '@/widgets/sidebar'
import { useGetGroupByIDQuery, useGetGroupNamesQuery } from '@/shared/redux'
import { useState, useEffect, useReducer } from 'react'
import { useSwipeable } from 'react-swipeable'
import { ErrorComponent } from '@/widgets/error'
import { BackToPreviousLink } from '@/entities/navigation'
import { MultiSelect } from '@/entities/multi-select'
import { getWeekDates } from '@/widgets/sidebar/utils'
import { Skeleton } from '@/shared/ui'
import { DaysButton } from '@/entities/days'
import { GroupInfo } from '@/widgets/groupInfo'
import { getTodayIndex } from '@/widgets/groupInfo/utils'

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

const { dayWeekIndex } = getTodayIndex()

const CreateTapStopPropagationHandler = () =>
  useSwipeable({
    onTap: (event) => {
      event.event.stopPropagation()
    },
  })

const groupListReducer = (
  state: string[],
  action: { type: string; payload?: string },
) => {
  switch (action.type) {
    case 'ADD':
      return action.payload && !state.includes(action.payload)
        ? [...state, action.payload]
        : state
    case 'REMOVE':
      return action.payload
        ? state.filter((id) => id !== action.payload)
        : state
    case 'SET':
      return action.payload ? [action.payload] : []
    default:
      return state
  }
}

export const GroupIDPage = () => {
  const { educationType, faculty, course, groupID = '' } = useParams()
  const navigate = useNavigate()

  const { data: groupNamesData } = useGetGroupNamesQuery()
  const [groupList, dispatchGroupList] = useReducer(groupListReducer, [groupID])

  const [pickedWeek, setPickedWeek] = useState<string>('')
  const [pickedDayIndex, setPickedDayIndex] = useState<DayIndex>(DayIndex.None)

  const [isSidebarVisible, setIsSidebarVisible] = useState(false)

  const week = getWeekDates(pickedWeek)

  const hideGroupDays = () => setIsSidebarVisible(false)
  const showGroupDays = () => setIsSidebarVisible(true)
  const toggleGroupDays = () => setIsSidebarVisible((prev) => !prev)

  const contentSwipeHandler = useSwipeable({
    onSwipedLeft: hideGroupDays,
    onSwipedRight: showGroupDays,
    onTap: () => {
      hideGroupDays()
    },
    preventScrollOnSwipe: true,
  })

  const daysListStopPropagationHandler = CreateTapStopPropagationHandler()

  const { data: groupData } = useGetGroupByIDQuery(
    groupList.length === 1 ? groupList[0] : groupID,
    {
      skip: !groupID,
    },
  )

  useEffect(() => {
    if (!groupData) {
      return
    }

    navigate(
      `/educationTypes/${groupData.educationType}/faculties/${groupData.faculty}/courses/${groupData.course}/groups/${groupData._id}`,
      { replace: true },
    )
  }, [
    groupData,
    groupData?._id,
    groupData?.course,
    groupData?.educationType,
    groupData?.faculty,
    navigate,
  ])

  useEffect(() => {
    setPickedDayIndex(dayWeekIndex)

    return () => {
      setPickedDayIndex(DayIndex.None)
      setPickedWeek('')
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
      <div className={style.weeksContainer}>
        <BackToPreviousLink
          href={`/educationTypes/${educationType ?? groupData?.educationType}/faculties/${faculty ?? groupData?.faculty}/courses/${course ?? groupData?.course}`}
        />

        <WeeksList pickedWeek={pickedWeek} setPickedWeek={setPickedWeek} />
      </div>

      <div className={style.content} {...contentSwipeHandler}>
        <div className={style.wrapper}>
          <Sibebar
            toggleIsSidebarVisible={toggleGroupDays}
            isSidebarVisible={isSidebarVisible}
            {...daysListStopPropagationHandler}
          >
            <ul className={style.list}>
              {groupNamesData && (
                <div className={style.groupSelect}>
                  <MultiSelect
                    defaultValue={groupID}
                    options={groupNamesData.map((item) => ({
                      value: item._id,
                      label: item.group,
                    }))}
                    onChange={(selectedIds: string[]) => {
                      dispatchGroupList({ type: 'SET', payload: '' })
                      selectedIds.forEach((id) =>
                        dispatchGroupList({ type: 'ADD', payload: id }),
                      )
                    }}
                  />
                </div>
              )}

              {!week.length
                ? Array.from({ length: 6 }).map((_, index) => (
                    <li className={style.listElement} key={index}>
                      <Skeleton className={style.skeleton} />
                    </li>
                  ))
                : week.map((day, index) => (
                    <li className={style.listElement} key={index}>
                      <DaysButton
                        onClick={() => {
                          setPickedDayIndex(index)
                        }}
                        isActive={pickedDayIndex === index}
                      >
                        {day}
                      </DaysButton>
                    </li>
                  ))}
            </ul>
          </Sibebar>

          <div className={style.groups}>
            {groupList.map((groupID) => (
              <GroupInfo
                groupID={groupID}
                pickedWeek={pickedWeek}
                pickedDayIndex={pickedDayIndex}
                key={groupID}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
