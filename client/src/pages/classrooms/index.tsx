import { useState } from 'react'
import {
  useGetAllClassroomsQuery,
  useCreateClassroomMutation,
  useUpdateClassroomMutation,
  useDeleteClassroomMutation,
  UpdateClassroomDTO,
  DeleteClassroomDTO,
  useGetClassroomsSchedulesQuery,
} from '@/shared/redux/slices/api/classroomsApi'
import * as style from './style.module.scss'
import { useAppSelector } from '@/shared/redux/hooks'
import { AdminAddButton } from '@/entities/admin'
import { Modal } from '@/widgets/modal'
import { ModalForm } from '@/widgets/modal-form'
import { ModalInput } from '@/widgets/modal-input'
import { ClassroomCell } from '@/widgets/classroom-cell'

export const ClassroomsPage = () => {
  const { data: classroomsData } = useGetAllClassroomsQuery()

  const ids = classroomsData?.map((classroom) => classroom._id) ?? []
  const { data: classroomsSchedulesData } = useGetClassroomsSchedulesQuery(ids, {
    skip: !ids.length,
  })

  const accessToken = useAppSelector((s) => s.auth.accessToken)

  const [isModalOpen, setIsModalOpen] = useState(false)

  const [createClassroom] = useCreateClassroomMutation()
  const [updateClassroom] = useUpdateClassroomMutation()
  const [deleteClassroom] = useDeleteClassroomMutation()

  const [formState, setFormState] = useState({
    name: '',
    capacity: '',
    description: '',
  })

  const handleChange = (field: keyof typeof formState, value: string) => {
    setFormState((prev) => ({ ...prev, [field]: value }))
  }

  const handleCancel = () => {
    setFormState({
      name: '',
      capacity: '',
      description: '',
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
      await createClassroom({
        name,
        capacity: capacityNum,
        description: description || undefined,
      }).unwrap()

      setFormState({
        name: '',
        capacity: '',
        description: '',
      })
      setIsModalOpen(false)
    } catch (err) {
      console.error('Ошибка при создании аудитории:', err)
    }
  }

  const handleUpdateClassroom = async (args: UpdateClassroomDTO) => {
    try {
      await updateClassroom(args).unwrap()
    } catch (err) {
      console.error('Ошибка при обновлении аудитории:', err)
    }
  }

  const handleDelete = async (args: DeleteClassroomDTO) => {
    if (!window.confirm('Вы уверены, что хотите удалить эту аудиторию?')) {
      return
    }

    try {
      await deleteClassroom(args).unwrap()
    } catch (err) {
      console.error('Ошибка при удалении аудитории:', err)
    }
  }

  return (
    <div className={style.container}>
      <div className={style.wrapper}>
        {classroomsData?.map((classroom) => (
          <ClassroomCell
            key={classroom._id}
            classroom={classroom}
            onUpdate={handleUpdateClassroom}
            onDelete={handleDelete}
          />
        ))}

        {accessToken && (
          <AdminAddButton onClick={() => setIsModalOpen(true)} isLocked={false}>
            Добавить аудиторию
          </AdminAddButton>
        )}
      </div>

      {isModalOpen && (
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
