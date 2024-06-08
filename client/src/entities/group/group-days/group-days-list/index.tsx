import { GroupDaysListProps } from './types'
import { GroupDaysButton } from '../group-days-button'
import { useEffect } from 'react'
import { useAppDispatch, useAppSelector, dayIndexChanged } from '@/shared/redux'

export const GroupDaysList = ({ daysData, listElementClassName }: GroupDaysListProps) => {
  const dispatch = useAppDispatch()

  const navigationValue = useAppSelector((store) => store.navigation.navigationValue)
  const { dayIndex: pickedDayIndex, week: pickedWeek } = navigationValue

  useEffect(() => {
    const todayDate = new Date()
    const currentDay = todayDate.getDate()
    const currentWeekDayIndex = todayDate.getDay() - 1
    const tomorrowDate = new Date(todayDate)
    tomorrowDate.setDate(currentDay + 1)
    const tomorrowDay = tomorrowDate.getDate()

    const dateToFind = currentDay !== 0 ? todayDate : tomorrowDate
    const monthToFind = String(dateToFind.getMonth() + 1).padStart(2, '0')
    const dayToFind = currentDay !== 0 ? currentDay : tomorrowDay

    const todayIndex = daysData.findIndex((date) => date.includes(`${dayToFind}.${monthToFind}.`))

    const indexToDispatch = todayIndex !== -1 ? todayIndex : currentWeekDayIndex
    dispatch(dayIndexChanged(indexToDispatch))
  }, [daysData])

  return (
    <>
      {daysData.map((day, index) => (
        <li className={listElementClassName} key={index}>
          <GroupDaysButton
            onClick={() => {
              dispatch(dayIndexChanged(index))
            }}
            data={{ text: day }}
            isActive={pickedDayIndex === index}
          />
        </li>
      ))}
    </>
  )
}
