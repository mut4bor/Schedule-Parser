import * as style from './style.module.scss'
import { Skeleton } from '@/shared/ui'
import { Link, useParams } from 'react-router-dom'
import {
  useGetGroupNamesQuery,
  useCreateGroupMutation,
  useUpdateGroupByIDMutation,
  useDeleteGroupByIDMutation,
  useAppSelector,
} from '@/shared/redux'
import { AddItem } from '@/widgets/add-item'
import { EditableItem } from '../editable-item'
import { Modal } from '../modal'
import { ModalInput } from '../modal-input'
import { ModalForm } from '../modal-form'
import { useState } from 'react'

export const GroupsList = () => {
  const accessToken = useAppSelector((store) => store.auth.accessToken)

  const { educationType, faculty, course } = useParams()
  const favoriteGroup = localStorage.getItem('favorite-group')

  const namesSearchParams = new URLSearchParams({
    educationType: educationType ?? '',
    faculty: faculty ?? '',
    course: course ?? '',
  }).toString()

  const { data: namesData } = useGetGroupNamesQuery(namesSearchParams)

  const [createGroup] = useCreateGroupMutation()
  const [updateGroupByID] = useUpdateGroupByIDMutation()
  const [deleteGroupByID] = useDeleteGroupByIDMutation()

  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleCreateGroup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const formData = new FormData(e.target as HTMLFormElement)
    const newGroup = formData.get('groupName') as string

    if (!newGroup || !educationType || !faculty || !course) return

    try {
      await createGroup({
        educationType,
        faculty,
        course,
        groupName: newGroup,
      }).unwrap()
    } catch (err) {
      console.error('Ошибка при создании группы:', err)
    }
  }

  const handleUpdateGroup = async (id: string, newGroup: string) => {
    if (!educationType || !faculty || !course) return
    try {
      await updateGroupByID({
        id,
        data: {
          groupName: newGroup,
        },
      }).unwrap()
    } catch (err) {
      console.error('Ошибка при обновлении группы:', err)
    }
  }

  const handleDeleteGroup = async (id: string) => {
    try {
      await deleteGroupByID(id).unwrap()
    } catch (err) {
      console.error('Ошибка при удалении группы:', err)
    }
  }

  const handleCancel = () => {
    setIsModalOpen(false)
  }

  console.log('namesData', namesData)

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
                  value={item.groupName}
                  crudHandlers={{
                    onUpdate: async (_, newValue) => handleUpdateGroup(item._id, newValue),
                    onDelete: async () => handleDeleteGroup(item._id),
                  }}
                >
                  <Link
                    to={`groups/${item._id}`}
                    className={`${style.link} ${favoriteGroup === item._id ? style.active : ''}`}
                  >
                    {item.groupName}
                  </Link>
                </EditableItem>
              </li>
            ))}
      </ul>

      {accessToken && (
        <AddItem
          addButtonLabel="Добавить группу"
          isAdding={isModalOpen}
          setIsAdding={setIsModalOpen}
        >
          <Modal onClose={handleCancel}>
            <ModalForm onSubmit={handleCreateGroup} onCancel={handleCancel}>
              <ModalInput label="Добавить группу:" name="groupName" defaultValue="" />
            </ModalForm>
          </Modal>
        </AddItem>
      )}
    </div>
  )
}
