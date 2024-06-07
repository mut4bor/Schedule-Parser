import * as style from './style.module.scss'
import { GroupButtonListProps } from './types'
import { Skeleton } from '@/shared/ui'
import { useState, useEffect } from 'react'
import { SkeletonTime } from '@/shared/vars/vars'
import { useAppSelector } from '@/shared/redux'

export const GroupSchedule = ({ data }: GroupButtonListProps) => {
  const picked = useAppSelector((store) => store.navigation.navigationValue)

  const { week: pickedWeek, dayIndex: pickedDayIndex } = picked

  const isDayPicked = !!pickedWeek && pickedDayIndex !== -1 && !!data?.dates[pickedWeek]

  const [coursesSkeletonIsEnabled, setCoursesSkeletonIsEnabled] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setCoursesSkeletonIsEnabled(false)
    }, SkeletonTime)
    return () => clearTimeout(timer)
  }, [])

  if (!isDayPicked || coursesSkeletonIsEnabled) {
    return (
      <div className={style.list}>
        <Skeleton style={{ minHeight: '3.6rem' }} />
        {Array.from({ length: 5 }).map((_, index) => (
          <Skeleton style={{ minHeight: '3.6rem' }} key={index} />
        ))}
      </div>
    )
  }

  const weekData = data.dates[pickedWeek]
  const daysOfWeek = Object.keys(weekData)
  const dayData = weekData[daysOfWeek[pickedDayIndex]]
  const entries = Object.entries(dayData)

  return (
    <div className={style.list}>
      <p className={style.heading}>{data.group}</p>
      {entries.map(([time, subject], index) => (
        <p key={index} className={style.text}>
          {`${time} – ${subject}`}
        </p>
      ))}
    </div>
  )
}
