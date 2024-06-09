import * as style from './style.module.scss'
import { ScheduleProps } from './types'
import { Skeleton } from '@/shared/ui'
import { useState, useEffect } from 'react'
import { SkeletonTime } from '@/shared/vars/vars'
import { useAppSelector } from '@/shared/redux'

export const Schedule = ({ scheduleData, groupName }: ScheduleProps) => {
  const [coursesSkeletonIsEnabled, setCoursesSkeletonIsEnabled] = useState(true)

  const { dayIndex: pickedDayIndex } = useAppSelector((store) => store.navigation.navigationValue)

  useEffect(() => {
    const timer = setTimeout(() => {
      setCoursesSkeletonIsEnabled(false)
    }, SkeletonTime)
    return () => clearTimeout(timer)
  }, [scheduleData])

  const isScheduleData =
    !!scheduleData &&
    !!groupName &&
    pickedDayIndex !== -1 &&
    !!scheduleData[Object.keys(scheduleData)[pickedDayIndex]] &&
    !coursesSkeletonIsEnabled

  return (
    <div className={style.list}>
      {!isScheduleData ? (
        <>
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton style={{ minHeight: '3.6rem' }} key={index} />
          ))}
        </>
      ) : (
        <>
          <p className={style.heading}>{groupName}</p>
          {Object.entries(scheduleData[Object.keys(scheduleData)[pickedDayIndex]]).map(([time, subject], index) => (
            <p key={index} className={style.text}>
              {`${time} – ${subject}`}
            </p>
          ))}
        </>
      )}
    </div>
  )
}
