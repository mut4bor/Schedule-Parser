import * as style from './style.module.scss'
import { getWeekNumber, getWeekValue } from './utils'
import { useEffect, useState } from 'react'
import { WeeksButton } from '@/entities/weeks'
import {
  useGetWeeksByGroupIdQuery,
  useCheckWeekAvailabilityMutation,
  useUpdateWeekScheduleMutation,
  useDeleteWeekScheduleMutation,
  CreateWeekDTO,
} from '@/shared/redux/slices/api/scheduleApi'
import { useAppSelector } from '@/shared/redux/hooks'
import { Skeleton } from '@/shared/ui'
import { useParams } from 'react-router-dom'
import { EditableItem } from '../editable-item'
import { AddItem } from '../add-item'
import { ModalForm } from '../modal-form'
import { ModalInput } from '../modal-input'
import { Modal } from '../modal'

const currentWeek = getWeekNumber(new Date())
const formattedCurrentWeek = `${currentWeek.year}-W${currentWeek.week}`

interface Props {
  pickedWeek: string
  setPickedWeek: (week: string) => void
}

export const WeeksList = ({ pickedWeek, setPickedWeek }: Props) => {
  const accessToken = useAppSelector((store) => store.auth.accessToken)

  const { groupID } = useParams()

  const { data: weeksData } = useGetWeeksByGroupIdQuery(groupID ?? '', {
    skip: !groupID,
  })

  const [createWeek] = useCheckWeekAvailabilityMutation()
  const [updateWeek] = useUpdateWeekScheduleMutation()
  const [deleteWeek] = useDeleteWeekScheduleMutation()

  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleCreateWeek = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const formData = new FormData(e.currentTarget)

    if (!groupID) return

    const typedForm: CreateWeekDTO = {
      id: groupID,
      weekName: String(formData.get('weekName') || undefined),
    }

    try {
      await createWeek(typedForm)
    } catch (err) {
      console.error('Ошибка при создании урока:', err)
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

  const handleCancel = () => {
    setIsModalOpen(false)
  }

  useEffect(() => {
    if (!weeksData?.length) return
    if (pickedWeek && weeksData.includes(pickedWeek)) return

    setPickedWeek(weeksData.includes(formattedCurrentWeek) ? formattedCurrentWeek : weeksData[0])
  }, [weeksData, pickedWeek, setPickedWeek])

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
          <AddItem
            addButtonLabel="Добавить неделю"
            isAdding={isModalOpen}
            setIsAdding={setIsModalOpen}
          >
            <Modal onClose={handleCancel}>
              <ModalForm onSubmit={handleCreateWeek} onCancel={handleCancel}>
                <ModalInput label="Добавить неделю:" name="weekName" defaultValue="" type="week" />
              </ModalForm>
            </Modal>
          </AddItem>
        </li>
      )}
    </ul>
  )
}
