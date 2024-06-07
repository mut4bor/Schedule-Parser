import * as style from './style.module.scss'
import { GroupSliderProps } from './types'
import { NavigationButton } from '@/entities/navigation-button'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { SkeletonTime } from '@/shared/vars/vars'
import { getCurrentWeekRange, getDaysInRange } from '@/shared/hooks'
import { useAppDispatch, useAppSelector, weekChanged, dayIndexChanged } from '@/shared/redux'

export const GroupSlider = ({ data }: GroupSliderProps) => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { monday, saturday } = getCurrentWeekRange()
  const range = `${monday}-${saturday}`

  const navigationValue = useAppSelector((store) => store.navigation.navigationValue)
  const { week: pickedWeek } = navigationValue

  useEffect(() => {
    if (data) {
      const { dates } = data
      if (!pickedWeek) {
        const scheduleKeys = Object.keys(dates)
        const daysRange = scheduleKeys.map((item) => getDaysInRange(item))
        const currentWeekIndex = daysRange.findIndex(
          (subArray) => subArray.includes(monday) && subArray.includes(saturday),
        )
        const currentWeek = scheduleKeys[currentWeekIndex]

        dispatch(weekChanged(currentWeek))
      }
    }
  }, [data, dispatch, range, navigationValue])

  const [coursesSkeletonIsEnabled, setCoursesSkeletonIsEnabled] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setCoursesSkeletonIsEnabled(false)
    }, SkeletonTime)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className={style.container}>
      <div>
        <NavigationButton
          text={'Назад'}
          onClick={() => {
            navigate('/courses')
            dispatch(weekChanged(''))
            dispatch(dayIndexChanged(-1))
          }}
        />
      </div>
      <ul className={style.list}>
        {!!data && !!data.dates && !coursesSkeletonIsEnabled
          ? Object.keys(data.dates).map((week, index) => (
              <li key={index}>
                <NavigationButton
                  text={week}
                  onClick={() => {
                    dispatch(weekChanged(week))
                  }}
                  isActive={pickedWeek === week}
                />
              </li>
            ))
          : Array.from({ length: 7 }).map((_, index) => (
              <li key={index}>
                <NavigationButton isSkeleton />
              </li>
            ))}
      </ul>
    </div>
  )
}
