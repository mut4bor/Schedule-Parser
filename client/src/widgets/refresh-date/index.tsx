import * as style from './style.module.scss'
import { RefreshDateProps } from './types'
import { format } from 'date-fns'
import { toZonedTime } from 'date-fns-tz'
import { Skeleton } from '@/shared/ui'
import { useState, useEffect } from 'react'
import { SkeletonTime } from '@/shared/vars/vars'

export const RefreshDate = ({ groupData }: RefreshDateProps) => {
  const [refreshDateSkeletonIsEnabled, setRefreshDateSkeletonIsEnabled] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setRefreshDateSkeletonIsEnabled(false)
    }, SkeletonTime)
    return () => clearTimeout(timer)
  }, [groupData])

  return (
    <>
      {!groupData || refreshDateSkeletonIsEnabled ? (
        <Skeleton className={style.skeleton} />
      ) : (
        <p className={style.refreshDate}>
          {`Обновлено ${format(toZonedTime(groupData.updatedAt, 'Europe/Moscow'), 'dd.MM.yyyy, HH:mm')}`}
        </p>
      )}
    </>
  )
}
