import * as style from './style.module.scss'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { WeeksList } from '@/widgets/weeks-list'
import { Sibebar } from '@/widgets/sidebar'
import { useGetGroupByIDQuery } from '@/shared/redux/slices/api/groupsApi'
import { useState, useEffect } from 'react'
import { useSwipeable } from 'react-swipeable'
import { BackToPreviousLink } from '@/entities/navigation'
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

export const GroupIDPage = () => {
  const location = useLocation()

  const { educationType, faculty, course, groupID = '' } = useParams()

  const navigate = useNavigate()

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

  const { data: groupData } = useGetGroupByIDQuery(groupID, {
    skip: !groupID,
  })

  useEffect(() => {
    if (!groupData) {
      return
    }

    navigate(
      `/educationTypes/${groupData.educationType}/faculties/${groupData.faculty}/courses/${groupData.course}/groups/${groupData._id}`,
      { replace: true },
    )
  }, [groupData, navigate])

  useEffect(() => {
    setPickedDayIndex(dayWeekIndex)

    return () => {
      setPickedDayIndex(DayIndex.None)
      setPickedWeek('')
    }
  }, [groupID])

  return (
    <div className={style.container} key={location.pathname}>
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
              {!week
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
            <GroupInfo groupID={groupID} pickedWeek={pickedWeek} pickedDayIndex={pickedDayIndex} />
          </div>
        </div>
      </div>
    </div>
  )
}
