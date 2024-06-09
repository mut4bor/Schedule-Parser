import * as style from './style.module.scss'
import { DaysListProps } from './types'
import { useState, useEffect } from 'react'
import { SVG, Skeleton } from '@/shared/ui'
import { SkeletonTime } from '@/shared/vars/vars'
import { useAppDispatch, useAppSelector, dayIndexChanged } from '@/shared/redux'
import { GroupDaysButton } from '@/entities/group'
import { getTodayIndex } from '@/shared/hooks'

export const DaysList = ({ scheduleData, handleSetIsGroupDaysVisible, isGroupDaysVisible }: DaysListProps) => {
  const dispatch = useAppDispatch()

  const [coursesSkeletonIsEnabled, setCoursesSkeletonIsEnabled] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setCoursesSkeletonIsEnabled(false)
    }, SkeletonTime)
    return () => clearTimeout(timer)
  }, [])

  const pickedDayIndex = useAppSelector((store) => store.navigation.navigationValue.dayIndex)

  useEffect(() => {
    if (scheduleData) {
      const todayIndex = getTodayIndex()
      const indexToDispatch = todayIndex !== 6 ? todayIndex : 0
      dispatch(dayIndexChanged(indexToDispatch))
    }
  }, [scheduleData])

  return (
    <div className={`${style.container} ${isGroupDaysVisible ? style.visible : style.hidden}`}>
      <button
        onClick={() => {
          handleSetIsGroupDaysVisible(!isGroupDaysVisible)
        }}
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
        {!!scheduleData && !coursesSkeletonIsEnabled
          ? Object.keys(scheduleData).map((day, index) => (
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
