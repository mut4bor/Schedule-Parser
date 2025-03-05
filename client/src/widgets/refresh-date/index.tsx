import * as style from './style.module.scss'
import { RefreshDateProps } from './types'
import { format } from 'date-fns'
import { toZonedTime } from 'date-fns-tz'
import { Skeleton } from '@/shared/ui'

export const RefreshDate = ({ date }: RefreshDateProps) => {
  if (!date) {
    return <Skeleton className={style.skeleton} />
  }

  return (
    <p className={style.refreshDate}>
      {`Обновлено ${format(toZonedTime(date, 'Europe/Moscow'), 'dd.MM.yyyy, HH:mm')}`}
    </p>
  )
}
