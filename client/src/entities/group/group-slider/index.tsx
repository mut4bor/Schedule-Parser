import * as style from './style.module.scss'
import { GroupSliderProps } from './types'
import { NavigationButton } from '@/entities/navigation-button'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getCurrentWeekRange, getDaysInRange } from '@/shared/hooks'
import { useAppDispatch, useAppSelector, navigationValueChanged, routerValueChanged } from '@/shared/redux'

export const GroupSlider = ({ data }: GroupSliderProps) => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { _id, educationType, faculty, course, dates } = data
  const { monday, saturday } = getCurrentWeekRange()
  const range = `${monday}-${saturday}`

  const picked = useAppSelector((store) => store.navigation.navigationValue)

  const { week: pickedWeek } = picked

  useEffect(() => {
    if (data) {
      dispatch(routerValueChanged({ educationType: educationType, faculty: faculty, course: course }))
      const scheduleKeys = Object.keys(dates)
      const daysRange = scheduleKeys.map((item) => getDaysInRange(item))
      const currentWeekIndex = daysRange.findIndex(
        (subArray) => subArray.includes(monday) && subArray.includes(saturday),
      )
      const currentWeek = scheduleKeys[currentWeekIndex]
      dispatch(navigationValueChanged({ ...picked, group: _id, week: currentWeek ?? scheduleKeys[0] }))
    }
  }, [data, dispatch, range, _id])

  if (dates) {
    const weeks = Object.keys(dates)

    return (
      <ul className={style.list}>
        <li>
          <NavigationButton
            text={'Назад'}
            onClick={() => {
              navigate('/courses')
            }}
          />
        </li>
        {weeks.map((week, key) => (
          <li key={key}>
            <NavigationButton
              text={week}
              onClick={() => {
                dispatch(navigationValueChanged({ ...picked, week: week }))
              }}
              isActive={pickedWeek === week}
            />
          </li>
        ))}
      </ul>
    )
  }

  return <ul className={style.list}></ul>
}
