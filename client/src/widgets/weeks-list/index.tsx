import * as style from './style.module.scss'
import { getWeekNumber, getWeekValue, useProcessedWeeks } from './utils'
import { useEffect } from 'react'
import { WeeksButton } from '@/entities/weeks'
import {
  useGetWeeksByIDQuery,
  useCreateWeekInGroupMutation,
  useUpdateWeekInGroupMutation,
  useDeleteWeekFromGroupMutation,
  useAppSelector,
} from '@/shared/redux'
import { Skeleton } from '@/shared/ui'
import { useParams } from 'react-router-dom'
import { EditableItem } from '../editable-item'
import { AddItem } from '../add-item'

const currentWeek = getWeekNumber(new Date())
const formattedCurrentWeek = `${currentWeek.year}-W${currentWeek.week}`

interface Props {
  pickedWeek: string
  setPickedWeek: (week: string) => void
}

export const WeeksList = ({ pickedWeek, setPickedWeek }: Props) => {
  const accessToken = useAppSelector((store) => store.auth.accessToken)

  const { groupID } = useParams()
  const { data: weeksData } = useGetWeeksByIDQuery(groupID ?? '', {
    skip: !groupID,
  })

  const processedWeeks = useProcessedWeeks(weeksData)

  const [createWeek] = useCreateWeekInGroupMutation()
  const [updateWeek] = useUpdateWeekInGroupMutation()
  const [deleteWeek] = useDeleteWeekFromGroupMutation()

  const handleCreateWeek = async (newWeek: string) => {
    if (!newWeek || !groupID) return
    try {
      await createWeek({ id: groupID, weekName: newWeek }).unwrap()
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
    if (!processedWeeks?.length) return
    if (pickedWeek && processedWeeks.includes(pickedWeek)) return

    setPickedWeek(
      processedWeeks.includes(formattedCurrentWeek) ? formattedCurrentWeek : processedWeeks[0],
    )
  }, [processedWeeks, pickedWeek, setPickedWeek])

  return (
    <ul className={style.list}>
      {!processedWeeks
        ? Array.from({ length: 7 }).map((_, index) => (
            <li key={index}>
              <Skeleton className={style.skeleton} />
            </li>
          ))
        : processedWeeks.map((week, index) => (
            <li className={style.listItem} key={index}>
              <EditableItem
                value={week}
                crudHandlers={
                  week === 'odd' || week === 'even'
                    ? null
                    : {
                        onUpdate: handleUpdateWeek,
                        onDelete: handleDeleteWeek,
                      }
                }
                type="week"
                min={formattedCurrentWeek}
              >
                <WeeksButton onClick={() => setPickedWeek(week)} isActive={pickedWeek === week}>
                  {getWeekValue(week)}
                </WeeksButton>
              </EditableItem>
            </li>
          ))}

      {accessToken && (
        <li>
          <AddItem onAdd={handleCreateWeek} type="week">
            Добавить неделю
          </AddItem>
        </li>
      )}
    </ul>
  )
}
