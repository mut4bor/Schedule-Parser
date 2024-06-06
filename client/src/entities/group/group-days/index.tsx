import * as style from './style.module.scss'
import { GroupDaysProps } from './types'
import { GroupDaysButton } from './group-days-button'
import { useEffect } from 'react'
import { useAppDispatch, useAppSelector, navigationValueChanged } from '@/shared/redux'

export const GroupDays = ({ data }: GroupDaysProps) => {
  const dispatch = useAppDispatch()
  const { _id, educationType, faculty, course, dates } = data

  const navigationValue = useAppSelector((store) => store.navigation.navigationValue)
  const { dayIndex: pickedDay, week: pickedWeek } = navigationValue

  useEffect(() => {
    if (!!dates && !!pickedWeek && !!dates[pickedWeek]) {
      if (pickedDay === -1) {
        const todayDate = new Date()
        const currentDay = todayDate.getDate()
        const currentWeekDayIndex = todayDate.getDay() - 1
        const tomorrowDate = new Date(todayDate)
        tomorrowDate.setDate(currentDay + 1)
        const tomorrowDay = tomorrowDate.getDate()

        const dateToFind = currentDay !== 0 ? todayDate : tomorrowDate
        const monthToFind = String(dateToFind.getMonth() + 1).padStart(2, '0')
        const dayToFind = currentDay !== 0 ? currentDay : tomorrowDay
        const days = Object.keys(dates[pickedWeek])

        const todayIndex = days.findIndex((date) => date.includes(`${dayToFind}.${monthToFind}.`))

        dispatch(
          navigationValueChanged({
            ...navigationValue,
            educationType,
            faculty,
            course,
            dayIndex: todayIndex !== -1 ? todayIndex : currentWeekDayIndex,
          }),
        )
      }
    }
  }, [data, dispatch, _id, pickedWeek])

  return (
    <ul className={style.list}>
      {!!pickedWeek &&
        !!dates[pickedWeek] &&
        Object.keys(dates[pickedWeek]).map((day, index) => (
          <li className={style.listElement} key={index}>
            <GroupDaysButton
              onClick={() => {
                dispatch(navigationValueChanged({ ...navigationValue, dayIndex: index }))
              }}
              data={{ text: day }}
              isActive={pickedDay === index}
            />
          </li>
        ))}
    </ul>
  )
}
