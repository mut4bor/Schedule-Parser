import * as style from './style.module.scss'
import { DaysListProps } from './types'
import { useEffect, forwardRef } from 'react'
import { SVG, Skeleton } from '@/shared/ui'
import { useAppDispatch, useAppSelector, dayIndexChanged } from '@/shared/redux'
import { DaysButton } from '@/entities/days'
import { getDayToPick } from '@/shared/hooks'

const ListElement = ({ children }: { children: React.ReactNode }) => {
  return <li className={style.listElement}>{children}</li>
}

export const DaysList = forwardRef<HTMLDivElement, DaysListProps>(
  ({ scheduleData, toggleIsGroupDaysVisible, isGroupDaysVisible }, ref) => {
    const dispatch = useAppDispatch()

    const pickedDayIndex = useAppSelector((store) => store.navigation.dayIndex)

    return (
      <div
        className={`${style.container} ${isGroupDaysVisible ? style.visible : style.hidden}`}
        ref={ref}
      >
        <button
          onClick={toggleIsGroupDaysVisible}
          className={style.arrowButton}
          type="button"
          title={`${isGroupDaysVisible ? 'Скрыть' : 'Показать'} дни недели`}
        >
          <SVG
            href="#arrow"
            svgClassName={`${style.arrowButtonSvg} ${isGroupDaysVisible ? style.rotated : null}`}
            useClassName={style.arrowButtonSvgUse}
          ></SVG>
        </button>
        <ul className={style.list}>
          {!scheduleData
            ? Array.from({ length: 6 }).map((_, index) => (
                <ListElement key={index}>
                  <Skeleton className={style.skeleton} />
                </ListElement>
              ))
            : Object.keys(scheduleData).map((day, index) => (
                <ListElement key={index}>
                  <DaysButton
                    onClick={() => {
                      dispatch(dayIndexChanged(index))
                    }}
                    isActive={pickedDayIndex === index}
                  >
                    {day}
                  </DaysButton>
                </ListElement>
              ))}
        </ul>
      </div>
    )
  },
)
