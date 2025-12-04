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
import { DayOfWeek } from '@/shared/redux/types'
import { useLocks } from '@/shared/hooks/useLocks'
import { useAppSelector } from '@/shared/redux/hooks'

const { dayWeekIndex } = getTodayIndex()

const CreateTapStopPropagationHandler = () =>
  useSwipeable({
    onTap: (event) => {
      event.event.stopPropagation()
    },
  })

export interface PickedWeekType {
  id: string
  name: string
}

export const GroupIDPage = () => {
  const location = useLocation()
  const navigate = useNavigate()

  const { educationType, faculty, course, groupID = '' } = useParams()

  const locked = useAppSelector((store) => store.locked)
  const isLocked = !!locked.groups.find((item) => item[0] === groupID)

  const { lock, unlock } = useLocks()

  useEffect(() => {
    lock('groups', groupID)

    const interval = setInterval(
      () => {
        lock('groups', groupID)
      },
      1000 * 60 * 3,
    )

    return () => {
      clearInterval(interval)
      unlock('groups', groupID)
    }
  }, [groupID, isLocked])

  const [pickedWeek, setPickedWeek] = useState<PickedWeekType | null>(null)
  const [pickedDayIndex, setPickedDayIndex] = useState<DayOfWeek>(DayOfWeek.None)

  const [isSidebarVisible, setIsSidebarVisible] = useState(false)

  const week = getWeekDates(pickedWeek?.name)

  const contentSwipeHandler = useSwipeable({
    onSwipedLeft: () => setIsSidebarVisible(false),
    onSwipedRight: () => setIsSidebarVisible(true),
    onTap: () => setIsSidebarVisible(false),
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
      `/educationTypes/${groupData.educationType._id}/faculties/${groupData.faculty._id}/courses/${groupData.course._id}/groups/${groupData._id}`,
      { replace: true },
    )
  }, [groupData, navigate])

  useEffect(() => {
    setPickedDayIndex(dayWeekIndex)

    return () => {
      setPickedDayIndex(DayOfWeek.None)
      setPickedWeek(null)
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
            toggleIsSidebarVisible={() => setIsSidebarVisible((prev) => !prev)}
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
