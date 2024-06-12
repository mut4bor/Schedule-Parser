import * as style from './style.module.scss'
import { ScheduleProps } from './types'
import { Skeleton } from '@/shared/ui'
import { useState, useEffect } from 'react'
import { SkeletonTime } from '@/shared/vars/vars'
import { useAppSelector } from '@/shared/redux'

export const Schedule = ({ scheduleData }: ScheduleProps) => {
  const [scheduleSkeletonIsEnabled, setScheduleSkeletonIsEnabled] = useState(true)
  const { dayIndex: pickedDayIndex } = useAppSelector((store) => store.navigation.navigationValue)

  useEffect(() => {
    const timer = setTimeout(() => {
      setScheduleSkeletonIsEnabled(false)
    }, SkeletonTime)
    return () => clearTimeout(timer)
  }, [scheduleData])

  const isScheduleData =
    !!scheduleData &&
    pickedDayIndex !== -1 &&
    !!scheduleData[Object.keys(scheduleData)[pickedDayIndex]] &&
    !scheduleSkeletonIsEnabled

  return (
    <div className={style.list}>
      {!isScheduleData
        ? Array.from({ length: 5 }).map((_, index) => <Skeleton className={style.skeleton} key={index} />)
        : Object.entries(scheduleData[Object.keys(scheduleData)[pickedDayIndex]]).map(([time, subject], index) => (
            <p className={style.text} key={index}>
              {`${time} – ${subject}`}
            </p>
          ))}
    </div>
  )
}
