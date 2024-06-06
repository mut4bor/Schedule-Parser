import * as style from './style.module.scss'
import { GroupSliderProps } from './types'
import { NavigationButton } from '@/entities/navigation-button'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getCurrentWeekRange, getDaysInRange } from '@/shared/hooks'
import { useAppDispatch, useAppSelector, navigationValueChanged } from '@/shared/redux'

export const GroupSlider = ({ data }: GroupSliderProps) => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { _id, educationType, faculty, course, dates } = data
  const { monday, saturday } = getCurrentWeekRange()
  const range = `${monday}-${saturday}`

  const navigationValue = useAppSelector((store) => store.navigation.navigationValue)
  const { week: pickedWeek } = navigationValue

  useEffect(() => {
    if (!!dates) {
      if (!pickedWeek) {
        const scheduleKeys = Object.keys(dates)
        const daysRange = scheduleKeys.map((item) => getDaysInRange(item))
        const currentWeekIndex = daysRange.findIndex(
          (subArray) => subArray.includes(monday) && subArray.includes(saturday),
        )
        const currentWeek = scheduleKeys[currentWeekIndex]

        dispatch(
          navigationValueChanged({
            ...navigationValue,
            educationType,
            faculty,
            course,
            week: currentWeek,
          }),
        )
      }
    }
  }, [data, dates, dispatch, range, _id, monday, saturday])

  return (
    <div className={style.container}>
      <div>
        <NavigationButton
          text={'Назад'}
          onClick={() => {
            navigate('/courses')
            dispatch(navigationValueChanged({ ...navigationValue, week: '', dayIndex: -1 }))
          }}
        />
      </div>
      <ul className={style.list}>
        {!!dates &&
          Object.keys(dates).map((week, key) => (
            <li key={key}>
              <NavigationButton
                text={week}
                onClick={() => {
                  dispatch(
                    navigationValueChanged({
                      ...navigationValue,
                      week: week,
                    }),
                  )
                }}
                isActive={pickedWeek === week}
              />
            </li>
          ))}
      </ul>
    </div>
  )
}
