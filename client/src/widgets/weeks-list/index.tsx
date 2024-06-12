import * as style from './style.module.scss'
import { WeeksListProps } from './types'
import { BackToPreviousButton } from '@/entities/navigation'
import { WeeksButton } from '@/entities/weeks'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { SkeletonTime } from '@/shared/vars/vars'
import { useAppDispatch, useAppSelector, weekChanged, dayIndexChanged, useGetWeeksByIDQuery } from '@/shared/redux'
import { getDaysInRange, getDayToPick } from '@/shared/hooks'
import { Skeleton } from '@/shared/ui'

export const WeeksList = ({ groupID }: WeeksListProps) => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const [weeksListSkeletonIsEnabled, setWeeksListSkeletonIsEnabled] = useState(true)
  const navigationValue = useAppSelector((store) => store.navigation.navigationValue)
  const { week: pickedWeek } = navigationValue

  const { data: weeksData, error: weeksError } = useGetWeeksByIDQuery(groupID, {
    skip: !groupID,
  })

  useEffect(() => {
    if (!!weeksData) {
      const { day } = getDayToPick()

      const daysRange = weeksData.map((item) => getDaysInRange(item))
      const currentWeekIndex = daysRange.findIndex((subArray) => subArray.includes(day))

      const currentWeek = weeksData[currentWeekIndex]
      dispatch(weekChanged(currentWeek))
    }
  }, [weeksData])

  useEffect(() => {
    const timer = setTimeout(() => {
      setWeeksListSkeletonIsEnabled(false)
    }, SkeletonTime)
    return () => clearTimeout(timer)
  }, [weeksData])

  return (
    <div className={style.container}>
      <div>
        <BackToPreviousButton
          onClick={() => {
            navigate('/courses')
            dispatch(weekChanged(''))
            dispatch(dayIndexChanged(-1))
          }}
        />
      </div>
      <ul className={style.list}>
        {!weeksData || weeksListSkeletonIsEnabled
          ? Array.from({ length: 7 }).map((_, index) => (
              <li key={index}>
                <Skeleton className={style.skeleton} />
              </li>
            ))
          : weeksData.map((week, index) => (
              <li key={index}>
                <WeeksButton
                  text={week}
                  onClick={() => {
                    dispatch(weekChanged(week))
                  }}
                  isActive={pickedWeek === week}
                />
              </li>
            ))}
      </ul>
    </div>
  )
}
