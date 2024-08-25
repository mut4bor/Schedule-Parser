import * as style from './style.module.scss'
import { WeeksListProps } from './types'
import { BackToPreviousButton } from '@/entities/navigation'
import { WeeksButton } from '@/entities/weeks'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { SkeletonTime } from '@/shared/vars/vars'
import {
  useAppDispatch,
  useAppSelector,
  weekChanged,
  dayIndexChanged,
} from '@/shared/redux'
import { getDaysInRange, getDayToPick } from '@/shared/hooks'
import { Skeleton } from '@/shared/ui'

export const WeeksList = ({ weeksData }: WeeksListProps) => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const [weeksListSkeletonIsEnabled, setWeeksListSkeletonIsEnabled] =
    useState(true)
  const { week: pickedWeek } = useAppSelector(
    (store) => store.navigation.navigationValue,
  )

  useEffect(() => {
    if (!!weeksData) {
      const { day } = getDayToPick()

      const daysRange = weeksData.map((item) => getDaysInRange(item))

      const currentWeekIndex = daysRange.findIndex((subArray) =>
        subArray.includes(day),
      )
      const currentWeek = weeksData[currentWeekIndex]
      if (currentWeek) {
        dispatch(weekChanged(currentWeek))
        return
      }
      dispatch(weekChanged(weeksData[0]))
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
      <BackToPreviousButton
        onClick={() => {
          navigate('/courses')
          dispatch(weekChanged(''))
          dispatch(dayIndexChanged(-1))
        }}
      />

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
