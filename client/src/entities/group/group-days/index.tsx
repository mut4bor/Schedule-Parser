import * as style from './style.module.scss'
import { GroupDaysProps } from './types'
import { GroupDaysButton } from './group-days-button'
import { SVG } from '@/shared/ui'
import { useState, useEffect } from 'react'
import { useAppDispatch, useAppSelector, dayIndexChanged, useGetWeekDaysByIDQuery } from '@/shared/redux'
import { Skeleton } from '@/shared/ui'
import { SkeletonTime } from '@/shared/vars/vars'

export const GroupDays = ({ groupID, handleSetIsGroupDaysVisible, isGroupDaysVisible }: GroupDaysProps) => {
  const dispatch = useAppDispatch()

  const navigationValue = useAppSelector((store) => store.navigation.navigationValue)
  const { dayIndex: pickedDayIndex, week: pickedWeek } = navigationValue

  const { data: daysData, error: daysError } = useGetWeekDaysByIDQuery({
    groupID: groupID,
    week: pickedWeek,
  })

  useEffect(() => {
    if (daysData) {
      if (pickedDayIndex === -1) {
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
      }
    }
  }, [daysData, dispatch, navigationValue])

  const [coursesSkeletonIsEnabled, setCoursesSkeletonIsEnabled] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setCoursesSkeletonIsEnabled(false)
    }, SkeletonTime)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className={`${style.container} ${isGroupDaysVisible ? style.visible : style.hidden}`}>
      <button
        onClick={(event) => {
          handleSetIsGroupDaysVisible(!isGroupDaysVisible)
        }}
        className={style.button}
        type="button"
        title="Скрыть/Показать дни недели"
      >
        <SVG
          href="#arrow"
          svgClassName={`${style.buttonSvg} ${isGroupDaysVisible ? style.rotated : ''}`}
          useClassName={style.buttonSvgUse}
        ></SVG>
      </button>
      <ul className={style.list}>
        {!!daysData && !coursesSkeletonIsEnabled
          ? daysData.map((day, index) => (
              <li className={style.listElement} key={index}>
                <GroupDaysButton
                  onClick={() => {
                    dispatch(dayIndexChanged(index))
                  }}
                  data={{ text: day }}
                  isActive={pickedDayIndex === index}
                />
              </li>
            ))
          : Array.from({ length: 6 }).map((_, index) => (
              <li className={style.listElement} key={index}>
                <Skeleton style={{ height: '3.6rem' }} />
              </li>
            ))}
      </ul>
    </div>
  )
}
