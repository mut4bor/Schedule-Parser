import * as style from './style.module.scss'
import { useState } from 'react'
import { Skeleton } from '@/shared/ui'
import { Modal } from '@/widgets/modal'
import { ModalForm } from '@/widgets/modal-form'
import { ModalInput } from '@/widgets/modal-input'
import { EditDeleteActions } from '@/entities/admin'
import { useAppSelector } from '@/shared/redux/hooks'
import { UpdateGroupDTO } from '@/shared/redux/slices/api/groupsApi'

interface GroupData {
  _id: string
  name: string
  capacity?: number
  description?: string
}

interface Props {
  group?: GroupData | null
  onUpdate: (args: UpdateGroupDTO) => Promise<void>
}

export const GroupHeading = ({ group, onUpdate }: Props) => {
  const accessToken = useAppSelector((store) => store.auth.accessToken)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const [formState, setFormState] = useState({
    name: group?.name ?? '',
    capacity: group?.capacity ?? 0,
    description: group?.description ?? '',
  })

  const handleChange = (field: keyof typeof formState, value: string) => {
    setFormState((prev) => ({
      ...prev,
      [field]: field === 'capacity' ? Number(value) || 0 : value,
    }))
  }

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!group?._id) return

    const payload: UpdateGroupDTO = {
      id: group._id,
      name: formState.name,
      capacity: formState.capacity || undefined,
      description: formState.description || undefined,
    }

    try {
      await onUpdate(payload)
      setIsModalOpen(false)
    } catch (err) {
      console.error('Ошибка при обновлении группы:', err)
    }
  }

  const handleCancel = () => {
    // при отмене откатываемся к данным группы
    if (group) {
      setFormState({
        name: group.name,
        capacity: group.capacity ?? 0,
        description: group.description ?? '',
      })
    }
    setIsModalOpen(false)
  }

  if (!group) {
    return <Skeleton className={style.skeleton} />
  }

  return (
    <>
      <div className={style.headingWrapper}>
        <p className={style.heading}>
          {group.name}
          {accessToken && group.capacity && ` (${group.capacity})`}
          {accessToken && group.description && `, ${group.description}`}
        </p>

        {accessToken && <EditDeleteActions onEdit={() => setIsModalOpen(true)} onDelete={null} />}
      </div>

      {isModalOpen && (
        <Modal onClose={handleCancel}>
          <ModalForm onSubmit={handleSave} onCancel={handleCancel}>
            <ModalInput
              label="Название группы:"
              name="groupName"
              value={formState.name}
              onChange={(e) => handleChange('name', e.target.value)}
            />

            <ModalInput
              label="Количество человек:"
              name="capacity"
              type="number"
              value={`${formState.capacity || ''}`}
              onChange={(e) => handleChange('capacity', e.target.value)}
            />

            <ModalInput
              label="Описание (необязательно):"
              name="description"
              value={formState.description}
              onChange={(e) => handleChange('description', e.target.value)}
            />
          </ModalForm>
        </Modal>
      )}
    </>
  )
}
