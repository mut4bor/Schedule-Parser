import * as style from './style.module.scss'
import { forwardRef } from 'react'
import { SVG, Skeleton } from '@/shared/ui'
import { useAppDispatch, useAppSelector, dayIndexChanged } from '@/shared/redux'
import { DaysButton } from '@/entities/days'
import { ISchedule, IWeek } from '@/shared/redux/types'

function formatDate(dateStr: string): string {
  const date = new Date(dateStr)

  // Проверка на корректность даты
  if (isNaN(date.getTime())) {
    // throw new Error('Некорректная дата')
    return dateStr
  }

  const weekdays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']

  // Получаем день и месяц с ведущим нулём
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')

  // В JS getDay(): 0 = Вс, 1 = Пн, ..., 6 = Сб
  const weekday = weekdays[(date.getDay() + 6) % 7]

  return `${day}.${month} (${weekday})`
}

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
            : Object.keys(scheduleData).map((day, index) => (
                <ListElement key={index}>
                  <DaysButton
                    onClick={() => {
                      dispatch(dayIndexChanged(index))
                    }}
                    isActive={pickedDayIndex === index}
                  >
                    {formatDate(day)}
                  </DaysButton>
                </ListElement>
              ))}
        </ul>
      </div>
    )
  },
)
