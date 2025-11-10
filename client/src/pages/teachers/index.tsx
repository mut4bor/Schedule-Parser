import { useState } from 'react'
import {
  useGetAllTeachersQuery,
  useCreateTeacherMutation,
  useUpdateTeacherMutation,
  useDeleteTeacherMutation,
  UpdateTeacherDTO,
  DeleteTeacherDTO,
} from '@/shared/redux/slices/api/teachersApi'
import * as style from './style.module.scss'
import { useAppSelector } from '@/shared/redux/hooks'
import { AddItem } from '@/widgets/add-item'
import { Modal } from '@/widgets/modal'
import { ModalForm } from '@/widgets/modal-form'
import { ModalInput } from '@/widgets/modal-input'
import { TeacherCell } from '@/widgets/teacher-cell'

export const TeachersPage = () => {
  const { data: teachersData } = useGetAllTeachersQuery()
  const accessToken = useAppSelector((store) => store.auth.accessToken)

  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleCancel = () => {
    setIsModalOpen(false)
  }

  const [createTeacher] = useCreateTeacherMutation()
  const [updateTeacher] = useUpdateTeacherMutation()
  const [deleteTeacher] = useDeleteTeacherMutation()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const formData = new FormData(e.target as HTMLFormElement)
    const firstName = formData.get('firstName') as string
    const lastName = formData.get('lastName') as string
    const middleName = formData.get('middleName') as string
    const title = formData.get('title') as string

    if (!firstName || !lastName || !middleName || !title) return

    try {
      await createTeacher({
        firstName,
        middleName,
        lastName,
        title,
      }).unwrap()
    } catch (err) {
      console.error('Ошибка при создании учителя:', err)
    }
  }

  const handleUpdateTeacher = async (args: UpdateTeacherDTO) => {
    try {
      await updateTeacher(args).unwrap()
    } catch (err) {
      console.error('Ошибка при обновлении урока:', err)
    }
  }

  const handleDelete = async (args: DeleteTeacherDTO) => {
    if (!window.confirm(`Вы уверены, что хотите удалить этого преподавателя?`)) return

    try {
      await deleteTeacher(args).unwrap()
    } catch (err) {
      console.error('Ошибка при удалении урока:', err)
    }
  }

  return (
    <div className={style.container}>
      <div className={style.wrapper}>
        {teachersData?.map((teacher) => (
          <TeacherCell
            teacher={teacher}
            onUpdate={handleUpdateTeacher}
            onDelete={handleDelete}
            key={teacher._id}
          />
        ))}

        {accessToken && (
          <AddItem
            addButtonLabel="Добавить преподавателя"
            isAdding={isModalOpen}
            setIsAdding={setIsModalOpen}
          >
            <Modal onClose={handleCancel}>
              <ModalForm onSubmit={handleSubmit} onCancel={handleCancel}>
                <ModalInput label="Фамилия:" name="lastName" defaultValue="" />
                <ModalInput label="Имя:" name="firstName" defaultValue="" />
                <ModalInput label="Отчество:" name="middleName" defaultValue="" />
                <ModalInput label="Титул:" name="title" defaultValue="" />
              </ModalForm>
            </Modal>
          </AddItem>
        )}
      </div>
    </div>
  )
}
