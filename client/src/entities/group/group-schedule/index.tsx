import * as style from './style.module.scss'
import { GroupButtonListProps } from './types'
import { Skeleton } from '@/shared/ui'
import { useState, useEffect } from 'react'
import { SkeletonTime } from '@/shared/vars/vars'
import { useAppSelector, useGetScheduleByIDQuery } from '@/shared/redux'

export const GroupSchedule = ({ groupID, groupName }: GroupButtonListProps) => {
  const picked = useAppSelector((store) => store.navigation.navigationValue)

  const { week: pickedWeek, dayIndex: pickedDayIndex } = picked

  const { data: scheduleData, error: scheduleError } = useGetScheduleByIDQuery({
    groupID: groupID,
    week: pickedWeek,
    dayIndex: pickedDayIndex,
  })

  const [coursesSkeletonIsEnabled, setCoursesSkeletonIsEnabled] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setCoursesSkeletonIsEnabled(false)
    }, SkeletonTime)
    return () => clearTimeout(timer)
  }, [])

  if (!scheduleData || !groupName || coursesSkeletonIsEnabled) {
    return (
      <div className={style.list}>
        <Skeleton style={{ minHeight: '3.6rem' }} />
        {Array.from({ length: 5 }).map((_, index) => (
          <Skeleton style={{ minHeight: '3.6rem' }} key={index} />
        ))}
      </div>
    )
  }

  return (
    <div className={style.list}>
      <p className={style.heading}>{groupName}</p>
      {Object.entries(scheduleData).map(([time, subject], index) => (
        <p key={index} className={style.text}>
          {`${time} – ${subject}`}
        </p>
      ))}
    </div>
  )
}
