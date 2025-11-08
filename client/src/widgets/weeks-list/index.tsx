import * as style from './style.module.scss'
import { getWeekNumber, getWeekValue } from './utils'
import { useEffect, useState } from 'react'
import { WeeksButton } from '@/entities/weeks'
import {
  useGetWeeksByGroupIdQuery,
  useCreateWeekScheduleMutation,
  useUpdateWeekScheduleMutation,
  useDeleteWeekScheduleMutation,
  CreateWeekDTO,
  UpdateWeekDTO,
  DeleteWeekDTO,
} from '@/shared/redux/slices/api/scheduleApi'
import { useAppSelector } from '@/shared/redux/hooks'
import { Skeleton } from '@/shared/ui'
import { useParams } from 'react-router-dom'
import { EditableItem } from '../editable-item'
import { AddItem } from '../add-item'
import { ModalForm } from '../modal-form'
import { ModalInput } from '../modal-input'
import { Modal } from '../modal'
import { PickedWeekType } from '@/pages/groupID'

const currentWeek = getWeekNumber(new Date())
const formattedCurrentWeek = `${currentWeek.year}-W${currentWeek.week}`

interface Props {
  pickedWeek: PickedWeekType | null
  setPickedWeek: (week: PickedWeekType) => void
}

export const WeeksList = ({ pickedWeek, setPickedWeek }: Props) => {
  const accessToken = useAppSelector((store) => store.auth.accessToken)

  const { groupID } = useParams()

  const { data: weeksData } = useGetWeeksByGroupIdQuery(groupID ?? '', {
    skip: !groupID,
  })

  const [createWeek] = useCreateWeekScheduleMutation()
  const [updateWeek] = useUpdateWeekScheduleMutation()
  const [deleteWeek] = useDeleteWeekScheduleMutation()

  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleCreateWeek = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const formData = new FormData(e.currentTarget)

    if (!groupID) return

    const typedForm: CreateWeekDTO = {
      weekName: String(formData.get('weekName') || undefined),
      groupID,
      days: [],
      isActive: false,
    }

    try {
      await createWeek(typedForm)
    } catch (err) {
      console.error('Ошибка при создании урока:', err)
    }
  }

  const handleUpdateWeek = async (args: UpdateWeekDTO) => {
    try {
      await updateWeek(args).unwrap()
    } catch (err) {
      console.error('Ошибка при обновлении недели:', err)
    }
  }

  const handleDeleteWeek = async (args: DeleteWeekDTO) => {
    try {
      await deleteWeek(args).unwrap()
    } catch (err) {
      console.error('Ошибка при удалении недели:', err)
    }
  }

  const handleCancel = () => {
    setIsModalOpen(false)
  }

  useEffect(() => {
    if (!weeksData?.length) return

    const pickedWeekInWeekData = weeksData.find((week) => week._id === pickedWeek?.id)

    if (pickedWeek && !!pickedWeekInWeekData) return

    const weekToPick = weeksData.find((week) => week.weekName === formattedCurrentWeek)

    const pickedWeekObject = {
      id: weekToPick?._id ?? weeksData[0]._id,
      name: weekToPick?.weekName ?? weeksData[0].weekName,
    }

    setPickedWeek(pickedWeekObject)
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
                value={week.weekName}
                crudHandlers={
                  week.weekName === 'odd' || week.weekName === 'even'
                    ? null
                    : {
                        onUpdate: (newValue) => {
                          setPickedWeek({
                            id: week._id,
                            name: newValue,
                          })
                          return handleUpdateWeek({
                            id: week._id,
                            weekName: newValue,
                          })
                        },
                        onDelete: () =>
                          handleDeleteWeek({
                            id: week._id,
                          }),
                      }
                }
                type="week"
                min={formattedCurrentWeek}
              >
                <WeeksButton
                  onClick={() => setPickedWeek({ id: week._id, name: week.weekName })}
                  isActive={pickedWeek?.name === week.weekName}
                >
                  {getWeekValue(week.weekName)}
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
