import * as style from './style.module.scss'
import { format } from 'date-fns'
import { toZonedTime } from 'date-fns-tz'
import { Skeleton } from '@/shared/ui'

interface Props {
  date: string | undefined
}

export const RefreshDate = ({ date }: Props) => {
  if (!date) {
    return <Skeleton className={style.skeleton} />
  }

  return (
    <p className={style.refreshDate}>
      {`Обновлено ${format(toZonedTime(date, 'Europe/Moscow'), 'dd.MM.yyyy, HH:mm')}`}
    </p>
  )
}
