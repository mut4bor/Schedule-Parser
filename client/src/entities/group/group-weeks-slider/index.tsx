import * as style from './style.module.scss'
import { GroupSliderProps } from './types'
import { NavigationButton } from '@/entities/navigation-button'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { SkeletonTime } from '@/shared/vars/vars'
import { getCurrentWeekRange, getDaysInRange } from '@/shared/hooks'
import { useAppDispatch, useAppSelector, weekChanged, dayIndexChanged, useGetWeeksByIDQuery } from '@/shared/redux'

export const GroupWeeksSlider = ({ groupID }: GroupSliderProps) => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const [coursesSkeletonIsEnabled, setCoursesSkeletonIsEnabled] = useState(true)

  const { monday, saturday } = getCurrentWeekRange()

  const navigationValue = useAppSelector((store) => store.navigation.navigationValue)
  const { week: pickedWeek } = navigationValue

  const { data: weeksData, error: weeksError } = useGetWeeksByIDQuery(groupID)

  useEffect(() => {
    if (weeksData) {
      if (!pickedWeek) {
        const daysRange = weeksData.map((item) => getDaysInRange(item))
        const currentWeekIndex = daysRange.findIndex(
          (subArray) => subArray.includes(monday) && subArray.includes(saturday),
        )

        const currentWeek = weeksData[currentWeekIndex]
        dispatch(weekChanged(currentWeek))
      }
    }
  }, [weeksData, dispatch, monday, saturday, navigationValue])

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
        {!!weeksData && !coursesSkeletonIsEnabled
          ? weeksData.map((week, index) => (
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
