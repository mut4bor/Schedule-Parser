import { GroupWeeksSliderListProps } from './types'
import { NavigationButton } from '@/entities/navigation-button'
import { useEffect } from 'react'
import { getCurrentWeekRange, getDaysInRange } from '@/shared/hooks'
import { useAppDispatch, useAppSelector, weekChanged } from '@/shared/redux'

export const GroupWeeksSliderList = ({ weeksData }: GroupWeeksSliderListProps) => {
  const dispatch = useAppDispatch()

  const { monday, saturday } = getCurrentWeekRange()

  const navigationValue = useAppSelector((store) => store.navigation.navigationValue)
  const { week: pickedWeek } = navigationValue

  useEffect(() => {
    const daysRange = weeksData.map((item) => getDaysInRange(item))
    const currentWeekIndex = daysRange.findIndex((subArray) => subArray.includes(monday) && subArray.includes(saturday))

    const currentWeek = weeksData[currentWeekIndex]
    dispatch(weekChanged(currentWeek))
  }, [weeksData])

  return (
    <>
      {weeksData.map((week, index) => (
        <li key={index}>
          <NavigationButton
            text={week}
            onClick={() => {
              dispatch(weekChanged(week))
            }}
            isActive={pickedWeek === week}
          />
        </li>
      ))}
    </>
  )
}
