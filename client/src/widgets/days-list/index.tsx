import * as style from './style.module.scss'
import { DaysListProps } from './types'
import { useState, useEffect } from 'react'
import { SVG, Skeleton } from '@/shared/ui'
import { SkeletonTime } from '@/shared/vars/vars'
import { useAppDispatch, useAppSelector, dayIndexChanged } from '@/shared/redux'
import { GroupDaysButton } from '@/entities/group'
import { getDayToPick } from '@/shared/hooks'

export const DaysList = ({ scheduleData, toggleIsGroupDaysVisible, isGroupDaysVisible }: DaysListProps) => {
  const dispatch = useAppDispatch()

  const [coursesSkeletonIsEnabled, setCoursesSkeletonIsEnabled] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setCoursesSkeletonIsEnabled(false)
    }, SkeletonTime)
    return () => clearTimeout(timer)
  }, [scheduleData])

  const pickedDayIndex = useAppSelector((store) => store.navigation.navigationValue.dayIndex)
  const { dayWeekIndex } = getDayToPick()

  useEffect(() => {
    if (scheduleData) {
      dispatch(dayIndexChanged(dayWeekIndex))
    }
  }, [scheduleData])

  return (
    <div className={`${style.container} ${isGroupDaysVisible ? style.visible : style.hidden}`}>
      <button
        onClick={toggleIsGroupDaysVisible}
        className={style.arrowButton}
        type="button"
        title="Скрыть/Показать дни недели"
      >
        <SVG
          href="#arrow"
          svgClassName={`${style.arrowButtonSvg} ${isGroupDaysVisible ? style.rotated : ''}`}
          useClassName={style.arrowButtonSvgUse}
        ></SVG>
      </button>
      <ul className={style.list}>
        {!scheduleData || coursesSkeletonIsEnabled
          ? Array.from({ length: 6 }).map((_, index) => (
              <li className={style.listElement} key={index}>
                <Skeleton className={style.skeleton} />
              </li>
            ))
          : Object.keys(scheduleData).map((day, index) => (
              <li className={style.listElement} key={index}>
                <GroupDaysButton
                  onClick={() => {
                    dispatch(dayIndexChanged(index))
                  }}
                  data={{ text: day }}
                  isActive={pickedDayIndex === index}
                />
              </li>
            ))}
      </ul>
    </div>
  )
}
