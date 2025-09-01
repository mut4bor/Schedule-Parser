import * as style from './style.module.scss'
import { forwardRef } from 'react'
import { SVG, Skeleton } from '@/shared/ui'
import { useAppDispatch, useAppSelector, dayIndexChanged } from '@/shared/redux'
import { DaysButton } from '@/entities/days'
import { IWeek } from '@/shared/redux/types'

const ListElement = ({ children }: { children: React.ReactNode }) => {
  return <li className={style.listElement}>{children}</li>
}

type Props = {
  scheduleData: IWeek | undefined
  toggleIsGroupDaysVisible: () => void
  isGroupDaysVisible: boolean
}

export const DaysList = forwardRef<HTMLDivElement, Props>(
  ({ scheduleData, toggleIsGroupDaysVisible, isGroupDaysVisible }, ref) => {
    const dispatch = useAppDispatch()

    const pickedDayIndex = useAppSelector((store) => store.navigation.dayIndex)

    console.log('scheduleData', scheduleData)

    return (
      <div
        className={`${style.container} ${isGroupDaysVisible ? style.visible : ''}`}
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
            : scheduleData.map((_, index) => (
                <ListElement key={index}>
                  <DaysButton
                    onClick={() => {
                      dispatch(dayIndexChanged(index))
                    }}
                    isActive={pickedDayIndex === index}
                  >
                    {index}
                  </DaysButton>
                </ListElement>
              ))}
        </ul>
      </div>
    )
  },
)
