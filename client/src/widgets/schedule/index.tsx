import * as style from './style.module.scss'
import { ScheduleProps } from './types'
import { Skeleton } from '@/shared/ui'
import { useState, useEffect } from 'react'
import { SkeletonTime } from '@/shared/vars/vars'
import { useAppSelector } from '@/shared/redux'
import { format } from 'date-fns'
import { toZonedTime } from 'date-fns-tz'

export const Schedule = ({ scheduleData, groupInfo }: ScheduleProps) => {
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
    !!groupInfo &&
    pickedDayIndex !== -1 &&
    !!scheduleData[Object.keys(scheduleData)[pickedDayIndex]] &&
    !coursesSkeletonIsEnabled

  return (
    <div className={style.list}>
      {!isScheduleData ? (
        <>
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton className={style.skeleton} key={index} />
          ))}
          <Skeleton style={{ marginLeft: 'auto', width: '24rem', minHeight: '1.6rem' }} />
        </>
      ) : (
        <>
          <p className={style.heading}>{groupInfo.group}</p>
          {Object.entries(scheduleData[Object.keys(scheduleData)[pickedDayIndex]]).map(([time, subject], index) => (
            <p key={index} className={style.text}>
              {`${time} – ${subject}`}
            </p>
          ))}
          <p className={style.refreshDate}>
            Обновлено {format(toZonedTime(groupInfo.updatedAt, 'Europe/Moscow'), 'dd.MM.yyyy, HH:mm')}
          </p>
        </>
      )}
    </div>
  )
}
