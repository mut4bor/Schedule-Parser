import * as style from './style.module.scss'
import { GroupDaysProps } from './types'
import { GroupDaysButton } from './group-days-button'
import { useEffect } from 'react'
import { useAppDispatch, useAppSelector, navigationValueChanged, routerValueChanged } from '@/shared/redux'

export const GroupDays = ({ data }: GroupDaysProps) => {
  const dispatch = useAppDispatch()
  const { _id, educationType, faculty, course, dates } = data

  const picked = useAppSelector((store) => store.navigation.navigationValue)
  const { day: pickedDay, week: pickedWeek } = picked

  useEffect(() => {
    if (data) {
      dispatch(routerValueChanged({ educationType: educationType, faculty: faculty, course: course }))
      if (pickedWeek) {
        const todayDate = new Date()
        const currentDay = todayDate.getDate()

        const tomorrowDate = new Date(todayDate)
        tomorrowDate.setDate(currentDay + 1)
        const tomorrowDay = tomorrowDate.getDate()

        const dateToFind = currentDay !== 0 ? todayDate : tomorrowDate
        const monthToFind = String(dateToFind.getMonth() + 1).padStart(2, '0')
        const dayToFind = currentDay !== 0 ? currentDay : tomorrowDay

        const days = Object.keys(dates[pickedWeek])

        const today = Object.keys(dates[pickedWeek]).find((date) => date.includes(`${dayToFind}.${monthToFind}.`))
        dispatch(navigationValueChanged({ ...picked, group: _id, week: pickedWeek, day: today ?? days[0] }))
      }
    }
  }, [data, dispatch, _id, pickedWeek])

  return (
    <ul className={style.list}>
      {pickedWeek &&
        Object.keys(dates[pickedWeek]).map((day, key) => (
          <li className={style.listElement} key={key}>
            <GroupDaysButton
              onClick={() => {
                dispatch(navigationValueChanged({ ...picked, day: day }))
              }}
              data={{ text: day }}
              isActive={pickedDay === day}
            />
          </li>
        ))}
    </ul>
  )
}
