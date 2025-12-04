import * as style from './style.module.scss'
import { useState } from 'react'
import { WeeksButton } from '@/entities/weeks'
import { useAppSelector } from '@/shared/redux/hooks'
import { UpdateWeekDTO, DeleteWeekDTO } from '@/shared/redux/slices/api/scheduleApi'
import { Modal } from '@/widgets/modal'
import { ModalForm } from '@/widgets/modal-form'
import { ModalInput } from '@/widgets/modal-input'
import { ModalSelect } from '@/widgets/modal-select'
import { EditDeleteActions } from '@/entities/admin'
import { getWeekValue } from '../utils'
import { PickedWeekType } from '@/pages/groupID'
import { useParams } from 'react-router-dom'

interface Week {
  _id: string
  weekName: string
}

interface Props {
  week: Week
  pickedWeek: PickedWeekType | null
  setPickedWeek: (week: PickedWeekType) => void
  onUpdate: (args: UpdateWeekDTO) => Promise<void>
  onDelete: (args: DeleteWeekDTO) => Promise<void>
}

const getInitialWeekType = (weekName: string) => {
  if (weekName === 'odd' || weekName === 'even') return weekName
  return 'specific'
}

const getInitialWeekValue = (weekName: string) => {
  if (weekName === 'odd' || weekName === 'even') return ''
  return weekName
}

export const WeekListItem = ({ week, pickedWeek, setPickedWeek, onUpdate, onDelete }: Props) => {
  const locked = useAppSelector((store) => store.locked)
  const { groupID } = useParams()
  const isLocked = !!locked.groups.find((item) => item[0] === groupID)

  const accessToken = useAppSelector((store) => store.auth.accessToken)

  const [isModalOpen, setIsModalOpen] = useState(false)

  const [formState, setFormState] = useState({
    weekType: getInitialWeekType(week.weekName),
    weekValue: getInitialWeekValue(week.weekName),
  })

  const handleChange = (field: keyof typeof formState, value: string) => {
    setFormState((prev) => ({ ...prev, [field]: value }))
  }

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const { weekType, weekValue } = formState
    const weekName = weekType === 'specific' ? weekValue : weekType

    if (!weekName) return

    try {
      await onUpdate({
        id: week._id,
        weekName,
      })

      // Обновляем выбранную неделю, если редактируем текущую
      setPickedWeek({
        id: week._id,
        name: weekName,
      })

      setIsModalOpen(false)
    } catch (err) {
      console.error('Ошибка при обновлении недели:', err)
    }
  }

  const handleCancel = () => {
    setIsModalOpen(false)
  }

  const handleDeleteClick = async () => {
    try {
      if (window.confirm('Вы действительно хотите удалить эту неделю?')) {
        await onDelete({ id: week._id })
      }
    } catch (err) {
      console.error('Ошибка при удалении недели:', err)
    }
  }

  const handlePick = () => {
    setPickedWeek({
      id: week._id,
      name: week.weekName,
    })
  }

  return (
    <li className={style.listItem}>
      <div className={style.lessonHeader}>
        <WeeksButton onClick={handlePick} isActive={pickedWeek?.name === week.weekName}>
          {getWeekValue(week.weekName)}
        </WeeksButton>

        {accessToken && (
          <EditDeleteActions
            onEdit={() => setIsModalOpen(true)}
            onDelete={handleDeleteClick}
            isLocked={isLocked}
          />
        )}
      </div>

      {isModalOpen && accessToken && (
        <Modal onClose={handleCancel}>
          <ModalForm onSubmit={handleSave} onCancel={handleCancel}>
            <ModalSelect
              label="Тип недели:"
              name="weekType"
              value={formState.weekType}
              onChange={(e) => handleChange('weekType', e.target.value)}
              options={[
                { value: 'odd', label: 'Нечетная' },
                { value: 'even', label: 'Четная' },
                { value: 'specific', label: 'Конкретная неделя' },
              ]}
            />

            {formState.weekType === 'specific' && (
              <ModalInput
                label="Неделя:"
                name="weekName"
                type="week"
                value={formState.weekValue}
                onChange={(e) => handleChange('weekValue', e.target.value)}
              />
            )}
          </ModalForm>
        </Modal>
      )}
    </li>
  )
}
