import * as style from './style.module.scss'
import { Skeleton } from '@/shared/ui'
import { Link, useParams } from 'react-router-dom'
import {
  useGetGroupNamesQuery,
  useCreateGroupMutation,
  useUpdateGroupByIDMutation,
  useDeleteGroupByIDMutation,
} from '@/shared/redux'
import { AddItem } from '@/widgets/add-item'
import { EditableItem } from '../editable-item'

export const GroupsList = () => {
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

  const handleCreateGroup = async (newGroup: string) => {
    if (!newGroup || !educationType || !faculty || !course) return
    try {
      await createGroup({
        educationType,
        faculty,
        course,
        group: newGroup,
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
          group: newGroup,
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
                  value={item.group}
                  crudHandlers={{
                    onUpdate: async (_, newValue) =>
                      handleUpdateGroup(item._id, newValue),
                    onDelete: async () => handleDeleteGroup(item._id),
                  }}
                >
                  <Link
                    to={`groups/${item._id}`}
                    className={`${style.link} ${
                      favoriteGroup === item._id ? style.active : ''
                    }`}
                  >
                    {item.group}
                  </Link>
                </EditableItem>
              </li>
            ))}
      </ul>

      <AddItem onAdd={handleCreateGroup}>Добавить группу</AddItem>
    </div>
  )
}
