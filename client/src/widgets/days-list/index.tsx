import * as style from './style.module.scss'
import { getWeekDates } from './utils'
import { forwardRef } from 'react'
import { Skeleton } from '@/shared/ui'
import { DaysButton } from '@/entities/days'
import { IWeek } from '@/shared/redux/types'

const ListElement = ({ children }: { children: React.ReactNode }) => {
  return <li className={style.listElement}>{children}</li>
}

interface Props {
  scheduleData: IWeek | undefined
  toggleIsGroupDaysVisible: () => void
  isGroupDaysVisible: boolean
  pickedWeek: string | null
  pickedDayIndex: number
  setPickedDayIndex: (dayIndex: number) => void
}

export const DaysList = forwardRef<HTMLDivElement, Props>(
  (
    {
      scheduleData,
      toggleIsGroupDaysVisible,
      isGroupDaysVisible,
      pickedWeek,
      pickedDayIndex,
      setPickedDayIndex,
    },
    ref,
  ) => {
    const week = getWeekDates(pickedWeek)

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
          <svg
            className={`${style.arrowButtonSvg} ${isGroupDaysVisible ? style.rotated : null}`}
            viewBox="0 0 96 96"
          >
            <path
              className={style.arrowButtonSvgUse}
              d="M69.8437,43.3876,33.8422,13.3863a6.0035,6.0035,0,0,0-7.6878,9.223l30.47,25.39-30.47,25.39a6.0035,6.0035,0,0,0,7.6878,9.2231L69.8437,52.6106a6.0091,6.0091,0,0,0,0-9.223Z"
            />
          </svg>
        </button>

        <ul className={style.list}>
          {!scheduleData || !week.length
            ? Array.from({ length: 6 }).map((_, index) => (
                <ListElement key={index}>
                  <Skeleton className={style.skeleton} />
                </ListElement>
              ))
            : scheduleData.map((_, index) => (
                <ListElement key={index}>
                  <DaysButton
                    onClick={() => {
                      setPickedDayIndex(index)
                    }}
                    isActive={pickedDayIndex === index}
                  >
                    {week[index]}
                  </DaysButton>
                </ListElement>
              ))}
        </ul>
      </div>
    )
  },
)
