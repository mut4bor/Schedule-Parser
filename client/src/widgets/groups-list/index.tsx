import * as style from './style.module.scss'
import { Skeleton } from '@/shared/ui'
import { Link, useParams } from 'react-router-dom'
import {
  useCreateGroupMutation,
  useUpdateGroupByIDMutation,
  useDeleteGroupByIDMutation,
  CreateGroupDTO,
  UpdateGroupDTO,
  DeleteGroupDTO,
} from '@/shared/redux/slices/api/groupsApi'
import { useGetGroupNamesQuery } from '@/shared/redux/slices/api/namesApi'
import { useAppSelector } from '@/shared/redux/hooks'
import { AdminAddButton } from '@/entities/admin'
import { EditableItem } from '@/widgets/editable-item'
import { Modal } from '@/widgets/modal'
import { ModalInput } from '@/widgets/modal-input'
import { ModalForm } from '@/widgets/modal-form'
import { useMemo, useState } from 'react'

export const GroupsList = () => {
  const accessToken = useAppSelector((store) => store.auth.accessToken)

  const { educationType, faculty, course } = useParams()
  const favoriteGroup = localStorage.getItem('favorite-group')

  const namesSearchParams = useMemo(() => {
    const params = new URLSearchParams()

    if (educationType) params.append('educationType', educationType)
    if (faculty) params.append('faculty', faculty)
    if (course) params.append('course', course)

    return params.toString()
  }, [educationType, faculty, course])

  const { data: namesData } = useGetGroupNamesQuery(namesSearchParams)
  const [createGroup] = useCreateGroupMutation()
  const [updateGroupByID] = useUpdateGroupByIDMutation()
  const [deleteGroupByID] = useDeleteGroupByIDMutation()

  const [isModalOpen, setIsModalOpen] = useState(false)

  const [formState, setFormState] = useState({
    name: '',
    capacity: 0,
    description: '',
  })

  const handleCreateGroup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!educationType || !faculty || !course) return

    const typedForm: CreateGroupDTO = {
      name: formState.name,
      educationType,
      faculty,
      course,
      capacity: formState.capacity,
      description: formState.description,
    }

    try {
      await createGroup(typedForm)
    } catch (err) {
      console.error('Ошибка при создании урока:', err)
    }
  }

  const handleUpdateGroup = async (args: UpdateGroupDTO) => {
    try {
      await updateGroupByID(args).unwrap()
    } catch (err) {
      console.error('Ошибка при обновлении группы:', err)
    }
  }

  const handleDeleteGroup = async (args: DeleteGroupDTO) => {
    try {
      await deleteGroupByID(args).unwrap()
    } catch (err) {
      console.error('Ошибка при удалении группы:', err)
    }
  }

  const handleCancel = () => {
    setIsModalOpen(false)
  }

  const handleChange = (field: keyof typeof formState, value: string) => {
    setFormState((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className={style.container}>
      <ul className={style.list}>
        {!namesData
          ? Array.from({ length: 16 }).map((_, index) => (
              <Skeleton className={style.skeleton} key={index} />
            ))
          : namesData.map((item) => (
              <li key={item._id}>
                <EditableItem
                  value={item.name}
                  crudHandlers={{
                    onUpdate: async (name) => handleUpdateGroup({ id: item._id, name }),
                    onDelete: async () => handleDeleteGroup({ id: item._id }),
                  }}
                >
                  <Link
                    to={`groups/${item._id}`}
                    className={`${style.link} ${favoriteGroup === item._id ? style.active : ''}`}
                  >
                    {item.name}
                  </Link>
                </EditableItem>
              </li>
            ))}
      </ul>

      {accessToken && course && (
        <AdminAddButton onClick={() => setIsModalOpen(true)} isLocked={false}>
          Добавить группу
        </AdminAddButton>
      )}

      {isModalOpen && (
        <Modal onClose={handleCancel}>
          <ModalForm onSubmit={handleCreateGroup} onCancel={handleCancel}>
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
    </div>
  )
}
