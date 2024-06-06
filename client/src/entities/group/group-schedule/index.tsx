import * as style from './style.module.scss'
import { GroupButtonListProps } from './types'
import { useAppSelector } from '@/shared/redux'

export const GroupSchedule = (props: GroupButtonListProps) => {
  const {
    data: { dates },
  } = props

  const picked = useAppSelector((store) => store.navigation.navigationValue)

  const { week: pickedWeek, dayIndex: pickedDayIndex } = picked

  const isDayPicked = !!pickedWeek && pickedDayIndex !== -1 && !!dates[pickedWeek]

  if (!isDayPicked) {
    return <div className=""></div>
  }

  const weekData = dates[pickedWeek]
  const daysOfWeek = Object.keys(weekData)
  const dayData = weekData[daysOfWeek[pickedDayIndex]]
  const entries = Object.entries(dayData)

  return (
    <div className={style.list}>
      {entries.map(([time, subject], key) => (
        <p key={key} className={style.text}>
          {`${time} – ${subject}`}
        </p>
      ))}
    </div>
  )
}
