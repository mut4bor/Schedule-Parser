import * as style from './style.module.scss'
import { DaysListProps } from './types'
import { useState, useEffect, forwardRef } from 'react'
import { SVG, Skeleton } from '@/shared/ui'
import { SkeletonTime } from '@/shared/vars/vars'
import { useAppDispatch, useAppSelector, dayIndexChanged } from '@/shared/redux'
import { DaysButton } from '@/entities/days'
import { getDayToPick } from '@/shared/hooks'

export const DaysList = forwardRef<HTMLDivElement, DaysListProps>(
  ({ scheduleData, toggleIsGroupDaysVisible, isGroupDaysVisible }, ref) => {
    const dispatch = useAppDispatch()

    const [daysListSkeletonIsEnabled, setDaysListSkeletonIsEnabled] = useState(true)

    useEffect(() => {
      const timer = setTimeout(() => {
        setDaysListSkeletonIsEnabled(false)
      }, SkeletonTime)
      return () => clearTimeout(timer)
    }, [scheduleData])

    const pickedDayIndex = useAppSelector((store) => store.navigation.navigationValue.dayIndex)
    const { dayWeekIndex } = getDayToPick()

    useEffect(() => {
      dispatch(dayIndexChanged(dayWeekIndex))
    }, [])

    return (
      <div ref={ref} className={`${style.container} ${isGroupDaysVisible ? style.visible : style.hidden}`}>
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
          {!scheduleData || daysListSkeletonIsEnabled
            ? Array.from({ length: 6 }).map((_, index) => (
                <li className={style.listElement} key={index}>
                  <Skeleton className={style.skeleton} />
                </li>
              ))
            : Object.keys(scheduleData).map((day, index) => (
                <li className={style.listElement} key={index}>
                  <DaysButton
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
  },
)
