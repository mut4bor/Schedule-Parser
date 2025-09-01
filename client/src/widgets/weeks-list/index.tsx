import * as style from './style.module.scss'
import { BackToPreviousLink } from '@/entities/navigation'
import { WeeksButton } from '@/entities/weeks'
import { useEffect } from 'react'
import {
  useAppDispatch,
  useAppSelector,
  useGetWeeksByIDQuery,
  useAddWeekToGroupMutation,
  useUpdateWeekInGroupMutation,
  useDeleteWeekFromGroupMutation,
  weekChanged,
} from '@/shared/redux'
import { getDaysInRange, getDayToPick } from '@/shared/hooks'
import { Skeleton } from '@/shared/ui'
import { ErrorComponent } from '@/widgets/error'
import { useParams } from 'react-router-dom'
import { EditableItem } from '../editable-item'
import { AddItem } from '../add-item'

const { day } = getDayToPick()

function formatWeekRange(weekValue: string): string {
  // Ожидаем формат "YYYY-Www"

  const match = /^(\d{4})-W(\d{2})$/.exec(weekValue)
  if (!match) return weekValue

  const year = parseInt(match[1], 10)
  const week = parseInt(match[2], 10)

  // Находим первый день недели (понедельник)
  const simple = new Date(year, 0, 1 + (week - 1) * 7)
  const dayOfWeek = simple.getDay()
  const ISOweekStart = new Date(simple)
  if (dayOfWeek <= 4) {
    ISOweekStart.setDate(simple.getDate() - simple.getDay() + 1)
  } else {
    ISOweekStart.setDate(simple.getDate() + 8 - simple.getDay())
  }

  // Конец недели (суббота)
  const ISOweekEnd = new Date(ISOweekStart)
  ISOweekEnd.setDate(ISOweekStart.getDate() + 5)

  const formatDate = (d: Date) =>
    `${String(d.getDate()).padStart(2, '0')}.${String(
      d.getMonth() + 1,
    ).padStart(2, '0')}`

  return `${formatDate(ISOweekStart)} - ${formatDate(ISOweekEnd)}`
}

export const WeeksList = () => {
  const { educationType, faculty, course, groupID } = useParams()

  const { data: weeksData, error: weeksError } = useGetWeeksByIDQuery(
    groupID ?? '',
    {
      skip: !groupID,
    },
  )

  const dispatch = useAppDispatch()
  const pickedWeek = useAppSelector((store) => store.navigation.week)

  const [addWeek] = useAddWeekToGroupMutation()
  const [updateWeek] = useUpdateWeekInGroupMutation()
  const [deleteWeek] = useDeleteWeekFromGroupMutation()

  // --- CRUD handlers ---
  const handleCreateWeek = async (newWeek: string) => {
    if (!newWeek || !groupID) return
    try {
      await addWeek({
        id: groupID,
        weekName: newWeek,
      }).unwrap()
    } catch (err) {
      console.error('Ошибка при создании недели:', err)
    }
  }

  const handleUpdateWeek = async (oldWeek: string, newWeek: string) => {
    if (!groupID) return
    try {
      await updateWeek({
        id: groupID,
        oldWeekName: oldWeek,
        newWeekName: newWeek,
      }).unwrap()
    } catch (err) {
      console.error('Ошибка при обновлении недели:', err)
    }
  }

  const handleDeleteWeek = async (week: string) => {
    if (!groupID) return
    if (window.confirm(`Удалить неделю "${week}"?`)) {
      try {
        await deleteWeek({ id: groupID, weekName: week }).unwrap()
      } catch (err) {
        console.error('Ошибка при удалении недели:', err)
      }
    }
  }

  // --- Автовыбор текущей недели ---
  useEffect(() => {
    if (!!weeksData) {
      const daysRange = weeksData.map((item) => getDaysInRange(item))
      const currentWeekIndex = daysRange.findIndex((subArray) =>
        subArray.includes(day),
      )
      const currentWeek = weeksData[currentWeekIndex]

      if (currentWeek) {
        dispatch(weekChanged(currentWeek))
        return
      }

      dispatch(weekChanged(weeksData[0]))
    }

    return () => {
      dispatch(weekChanged(null))
    }
  }, [dispatch, weeksData])

  if (weeksError) {
    return <ErrorComponent error={weeksError} />
  }

  return (
    <div className={style.container}>
      <BackToPreviousLink
        href={`/educationTypes/${educationType}/faculties/${faculty}/courses/${course}`}
      />

      <ul className={style.list}>
        {!weeksData
          ? Array.from({ length: 7 }).map((_, index) => (
              <li key={index}>
                <Skeleton className={style.skeleton} />
              </li>
            ))
          : weeksData.map((week, index) => (
              <li className={style.listItem} key={index}>
                <EditableItem
                  value={week}
                  crudHandlers={{
                    onUpdate: handleUpdateWeek,
                    onDelete: handleDeleteWeek,
                  }}
                  type="week"
                >
                  <WeeksButton
                    text={formatWeekRange(week)}
                    onClick={() => {
                      dispatch(weekChanged(week))
                    }}
                    isActive={pickedWeek === week}
                  />
                </EditableItem>
              </li>
            ))}
        <li>
          <AddItem
            label="Добавить неделю"
            onAdd={handleCreateWeek}
            type="week"
          />
        </li>
      </ul>
    </div>
  )
}
