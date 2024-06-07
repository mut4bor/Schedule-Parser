import { SkeletonParagraph } from '@/shared/ui'
import * as style from './style.module.scss'
import { GroupButtonListProps } from './types'
import { useAppSelector } from '@/shared/redux'

export const GroupSchedule = ({ data }: GroupButtonListProps) => {
  const picked = useAppSelector((store) => store.navigation.navigationValue)

  const { week: pickedWeek, dayIndex: pickedDayIndex } = picked

  const isDayPicked = !!pickedWeek && pickedDayIndex !== -1 && !!data?.dates[pickedWeek]

  if (!isDayPicked) {
    return (
      <div className={style.list}>
        {Array.from({ length: 5 }).map((_, index) => (
          <SkeletonParagraph style={{ minHeight: '3.6rem' }} key={index} />
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
      {entries.map(([time, subject], index) => (
        <p key={index} className={style.text}>
          {`${time} – ${subject}`}
        </p>
      ))}
    </div>
  )
}
