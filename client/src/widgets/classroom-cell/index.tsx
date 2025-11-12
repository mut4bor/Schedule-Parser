import * as style from './style.module.scss'
import { useState } from 'react'
import {
  Classroom,
  UpdateClassroomDTO,
  DeleteClassroomDTO,
} from '@/shared/redux/slices/api/classroomsApi'
import { useAppSelector } from '@/shared/redux/hooks'
import { Modal } from '@/widgets/modal'
import { ModalForm } from '@/widgets/modal-form'
import { ModalInput } from '@/widgets/modal-input'
import { EditDeleteActions } from '@/entities/admin'

interface Props {
  classroom: Classroom
  onUpdate: (args: UpdateClassroomDTO) => Promise<void>
  onDelete: (args: DeleteClassroomDTO) => Promise<void>
}

export const ClassroomCell = ({ classroom, onUpdate, onDelete }: Props) => {
  const accessToken = useAppSelector((s) => s.auth.accessToken)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const [formState, setFormState] = useState({
    name: classroom.name || '',
    capacity: String(classroom.capacity ?? ''),
    description: classroom.description || '',
  })

  const handleChange = (field: keyof typeof formState, value: string) => {
    setFormState((prev) => ({ ...prev, [field]: value }))
  }

  const handleCancel = () => {
    setFormState({
      name: classroom.name || '',
      capacity: String(classroom.capacity ?? ''),
      description: classroom.description || '',
    })
    setIsModalOpen(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const { name, capacity, description } = formState

    const capacityNum = Number(capacity)
    if (!name || !capacity || Number.isNaN(capacityNum) || capacityNum <= 0) {
      console.warn('Название и корректная вместимость обязательны для заполнения.')
      return
    }

    try {
      await onUpdate({
        id: classroom._id,
        data: {
          name,
          capacity: capacityNum,
          description,
        },
      })
      setIsModalOpen(false)
    } catch (err) {
      console.error('Ошибка при обновлении аудитории:', err)
    }
  }

  return (
    <div className={style.container}>
      <p className={style.text}>
        {classroom.name} ({classroom.capacity})
        {classroom.description ? ` — ${classroom.description}` : ''}
      </p>

      {accessToken && (
        <EditDeleteActions
          onEdit={() => setIsModalOpen(true)}
          onDelete={() => onDelete({ id: classroom._id })}
        />
      )}

      {accessToken && isModalOpen && (
        <Modal onClose={handleCancel}>
          <ModalForm onSubmit={handleSubmit} onCancel={handleCancel}>
            <ModalInput
              label="Название:"
              name="name"
              value={formState.name}
              onChange={(e) => handleChange('name', e.target.value)}
            />
            <ModalInput
              label="Вместимость:"
              name="capacity"
              value={formState.capacity}
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
    </div>
  )
}
