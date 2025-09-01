import * as style from './style.module.scss'
import { forwardRef } from 'react'
import { SVG, Skeleton } from '@/shared/ui'
import { DaysButton } from '@/entities/days'
import { IWeek } from '@/shared/redux/types'

function getWeekDates(weekStr: string | undefined | null) {
  if (!weekStr) return []

  if (typeof weekStr !== 'string' || weekStr.trim() === '') {
    return []
  }

  const match = /^(\d{4})-W(\d{2})$/.exec(weekStr)
  if (!match) {
    console.error('Неверный формат. Используйте YYYY-Www (например, 2025-W33)')

    return []
  }

  const year = parseInt(match[1], 10)
  const week = parseInt(match[2], 10)

  // Находим первый четверг года (ISO 8601)
  const jan4 = new Date(Date.UTC(year, 0, 4))
  const dayOfWeek = jan4.getUTCDay() || 7
  const firstThursday = new Date(Date.UTC(year, 0, 4 + (4 - dayOfWeek)))

  // Первая неделя ISO начинается с понедельника
  const weekStart = new Date(
    firstThursday.getTime() + (week - 1) * 7 * 24 * 60 * 60 * 1000,
  )
  weekStart.setUTCDate(weekStart.getUTCDate() - 3)

  const daysOfWeek = ['Вс.', 'Пн.', 'Вт.', 'Ср.', 'Чт.', 'Пт.', 'Сб.']

  const days: string[] = []
  for (let i = 0; i < 7; i++) {
    const d = new Date(weekStart)
    d.setUTCDate(weekStart.getUTCDate() + i)

    const day = String(d.getUTCDate()).padStart(2, '0')
    const month = String(d.getUTCMonth() + 1).padStart(2, '0')
    const weekday = daysOfWeek[d.getUTCDay()]

    days.push(`${day}.${month} (${weekday})`)
  }

  return days
}

const ListElement = ({ children }: { children: React.ReactNode }) => {
  return <li className={style.listElement}>{children}</li>
}

type Props = {
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
