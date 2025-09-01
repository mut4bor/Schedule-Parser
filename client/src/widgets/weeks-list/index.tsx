import * as style from './style.module.scss'
import { BackToPreviousLink } from '@/entities/navigation'
import { WeeksButton } from '@/entities/weeks'
import { useEffect } from 'react'
import {
  useGetWeeksByIDQuery,
  useAddWeekToGroupMutation,
  useUpdateWeekInGroupMutation,
  useDeleteWeekFromGroupMutation,
} from '@/shared/redux'
import { Skeleton } from '@/shared/ui'
import { ErrorComponent } from '@/widgets/error'
import { useParams } from 'react-router-dom'
import { EditableItem } from '../editable-item'
import { AddItem } from '../add-item'

function getWeekNumber(date: Date): { year: number; week: number } {
  const tmp = new Date(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()),
  )
  const dayNum = tmp.getUTCDay() || 7
  tmp.setUTCDate(tmp.getUTCDate() + 4 - dayNum)
  const yearStart = new Date(Date.UTC(tmp.getUTCFullYear(), 0, 1))
  const weekNo = Math.ceil(((+tmp - +yearStart) / 86400000 + 1) / 7)
  return { year: tmp.getUTCFullYear(), week: weekNo }
}

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

interface Props {
  pickedWeek: string | null
  setPickedWeek: (week: string | null) => void
}

export const WeeksList = ({ pickedWeek, setPickedWeek }: Props) => {
  const { educationType, faculty, course, groupID } = useParams()

  const { data: weeksData } = useGetWeeksByIDQuery(groupID ?? '', {
    skip: !groupID,
  })

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
      setPickedWeek(newWeek)
    } catch (err) {
      console.error('Ошибка при обновлении недели:', err)
    }
  }

  const handleDeleteWeek = async (week: string) => {
    if (!groupID) return
    try {
      await deleteWeek({ id: groupID, weekName: week }).unwrap()
    } catch (err) {
      console.error('Ошибка при удалении недели:', err)
    }
  }

  // --- Автовыбор текущей недели ---
  useEffect(() => {
    if (!!weeksData) {
      const currentWeek = getWeekNumber(new Date())
      const formattedCurrentWeek = `${currentWeek.year}-W${currentWeek.week}`

      const currentWeekData = weeksData.find(
        (week) => week === formattedCurrentWeek,
      )

      if (!!currentWeekData) {
        setPickedWeek(`${currentWeek.year}-W${currentWeek.week}`)
        return
      }

      setPickedWeek(weeksData[0])
    }

    return () => {
      setPickedWeek(null)
    }
  }, [weeksData])

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
                    onClick={() => {
                      setPickedWeek(week)
                    }}
                    isActive={pickedWeek === week}
                  >
                    {formatWeekRange(week)}
                  </WeeksButton>
                </EditableItem>
              </li>
            ))}
        <li>
          <AddItem onAdd={handleCreateWeek} type="week">
            Добавить неделю
          </AddItem>
        </li>
      </ul>
    </div>
  )
}
