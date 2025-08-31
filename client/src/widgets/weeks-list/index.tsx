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
                >
                  <WeeksButton
                    text={week}
                    onClick={() => {
                      dispatch(weekChanged(week))
                    }}
                    isActive={pickedWeek === week}
                  />
                </EditableItem>
              </li>
            ))}
        <li>
          <AddItem label="Добавить неделю" onAdd={handleCreateWeek} />
        </li>
      </ul>
    </div>
  )
}
