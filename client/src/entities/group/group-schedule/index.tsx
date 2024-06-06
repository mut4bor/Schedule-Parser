import * as style from './style.module.scss'
import { GroupButtonListProps } from './types'
import { useAppSelector } from '@/shared/redux'

export const GroupSchedule = (props: GroupButtonListProps) => {
  const {
    data: { dates },
  } = props

  const picked = useAppSelector((store) => store.navigation.navigationValue)

  const { week: pickedWeek, day: pickedDay } = picked

  const isDayPicked = pickedWeek && pickedDay && dates[pickedWeek] && dates[pickedWeek][pickedDay]

  return (
    <div className={style.list}>
      {isDayPicked &&
        Object.entries(dates[picked.week][picked.day]).map(([time, subject], key) => (
          <p key={key} className={style.text}>
            {`${time} – ${subject}`}
          </p>
        ))}
    </div>
  )
}
