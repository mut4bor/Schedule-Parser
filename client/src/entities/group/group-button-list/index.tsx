import * as style from './style.module.scss'
import { GroupButtonListProps } from './types'
import { GroupButton } from '@/entities/group'
import { useEffect } from 'react'
import { getCurrentWeekRange, getDaysInRange } from '@/shared/hooks'
import { useAppDispatch, useAppSelector, navigationValueChanged, routerValueChanged } from '@/shared/redux'

export const GroupButtonList = (props: GroupButtonListProps) => {
  const dispatch = useAppDispatch()
  const { data } = props
  const { _id, educationType, faculty, course, group, dates } = data
  const { monday, saturday } = getCurrentWeekRange()
  const range = `${monday}-${saturday}`

  const picked = useAppSelector((store) => store.navigation.navigationValue)
  useEffect(() => {
    if (data) {
      dispatch(routerValueChanged({ educationType: educationType, faculty: faculty, course: course }))

      const scheduleKeys = Object.keys(dates)
      const daysRange = scheduleKeys.map((item) => getDaysInRange(item))
      const currentWeekIndex = daysRange.findIndex(
        (subArray) => subArray.includes(monday) && subArray.includes(saturday),
      )
      const currentWeek = scheduleKeys[currentWeekIndex]
      if (currentWeek) {
        const todayDate = new Date()
        const currentDay = todayDate.getDate()

        const tomorrowDate = new Date(todayDate)
        tomorrowDate.setDate(currentDay + 1)
        const tomorrowDay = tomorrowDate.getDate()

        const dateToFind = currentDay !== 0 ? todayDate : tomorrowDate
        const monthToFind = String(dateToFind.getMonth() + 1).padStart(2, '0')
        const dayToFind = currentDay !== 0 ? currentDay : tomorrowDay

        const today = Object.keys(dates[currentWeek]).find((date) => date.includes(`${dayToFind}.${monthToFind}.`))
        if (today) {
          dispatch(navigationValueChanged({ ...picked, group: _id, week: currentWeek, day: today }))
          return
        }
        dispatch(navigationValueChanged({ ...picked, group: _id, week: currentWeek }))
        return
      }
      dispatch(navigationValueChanged({ ...picked, group: _id }))
    }
  }, [data, dispatch, range, _id])

  const isDayPicked = picked.day && dates[picked.week] && dates[picked.week][picked.day]
  const isWeekPicked = picked.week && dates[picked.week]

  const renderButtons = (items: string[], type: 'week' | 'day') => {
    return items.map((item, key) => (
      <GroupButton
        key={key}
        onClick={() => {
          dispatch(navigationValueChanged({ ...picked, [type]: item }))
        }}
      >
        {item}
      </GroupButton>
    ))
  }

  const renderTexts = (items: [string, string][]) => {
    return items.map(([time, subject], key) => (
      <p key={key} className={style.text}>
        {`${time} – ${subject}`}
      </p>
    ))
  }

  const handleRender = () => {
    if (isDayPicked) {
      return renderTexts(Object.entries(dates[picked.week][picked.day]))
    }
    if (isWeekPicked) {
      return renderButtons(Object.keys(dates[picked.week]), 'day')
    }
    if (dates) {
      return renderButtons(Object.keys(dates), 'week')
    }
    return null
  }

  return <div className={style.list}>{handleRender()}</div>
}
