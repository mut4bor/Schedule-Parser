import * as style from './style.module.scss'
import { getWeekNumber, formatWeekRange } from './utils'
import { WeeksButton } from '@/entities/weeks'
import { useEffect } from 'react'
import {
  useGetWeeksByIDQuery,
  useAddWeekToGroupMutation,
  useUpdateWeekInGroupMutation,
  useDeleteWeekFromGroupMutation,
} from '@/shared/redux'
import { Skeleton } from '@/shared/ui'
import { useParams } from 'react-router-dom'
import { EditableItem } from '../editable-item'
import { AddItem } from '../add-item'

interface Props {
  pickedWeek: string
  setPickedWeek: (week: string) => void
}

export const WeeksList = ({ pickedWeek, setPickedWeek }: Props) => {
  const { groupID } = useParams()

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

  useEffect(() => {
    if (!weeksData || weeksData.length === 0) return

    if (pickedWeek && weeksData.includes(pickedWeek)) return

    const currentWeek = getWeekNumber(new Date())
    const formattedCurrentWeek = `${currentWeek.year}-W${currentWeek.week}`

    setPickedWeek(
      weeksData.includes(formattedCurrentWeek)
        ? formattedCurrentWeek
        : weeksData[0],
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [weeksData])

  return (
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
  )
}
