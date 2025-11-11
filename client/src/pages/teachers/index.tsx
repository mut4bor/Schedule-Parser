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
import { AdminAddButton } from '@/entities/admin'
import { Modal } from '@/widgets/modal'
import { ModalForm } from '@/widgets/modal-form'
import { ModalInput } from '@/widgets/modal-input'
import { TeacherCell } from '@/widgets/teacher-cell'

export const TeachersPage = () => {
  const { data: teachersData } = useGetAllTeachersQuery()

  const accessToken = useAppSelector((store) => store.auth.accessToken)

  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleCancel = () => {
    setFormState({
      lastName: '',
      firstName: '',
      middleName: '',
      title: '',
    })
    setIsModalOpen(false)
  }

  const [createTeacher] = useCreateTeacherMutation()
  const [updateTeacher] = useUpdateTeacherMutation()
  const [deleteTeacher] = useDeleteTeacherMutation()

  const [formState, setFormState] = useState({
    lastName: '',
    firstName: '',
    middleName: '',
    title: '',
  })

  const handleChange = (field: keyof typeof formState, value: string) => {
    setFormState((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const { firstName, lastName, middleName, title } = formState

    if (!firstName || !lastName || !middleName || !title) {
      console.warn('Все поля обязательны для заполнения.')
      return
    }

    try {
      await createTeacher({
        firstName,
        middleName,
        lastName,
        title,
      }).unwrap()

      setFormState({
        lastName: '',
        firstName: '',
        middleName: '',
        title: '',
      })
      setIsModalOpen(false)
    } catch (err) {
      console.error('Ошибка при создании учителя:', err)
    }
  }

  const handleUpdateTeacher = async (args: UpdateTeacherDTO) => {
    try {
      await updateTeacher(args).unwrap()
    } catch (err) {
      console.error('Ошибка при обновлении преподавателя:', err)
    }
  }

  const handleDelete = async (args: DeleteTeacherDTO) => {
    if (!window.confirm(`Вы уверены, что хотите удалить этого преподавателя?`)) return

    try {
      await deleteTeacher(args).unwrap()
    } catch (err) {
      console.error('Ошибка при удалении преподавателя:', err)
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
          <AdminAddButton onClick={() => setIsModalOpen(true)}>
            Добавить преподавателя
          </AdminAddButton>
        )}
      </div>

      {isModalOpen && (
        <Modal onClose={handleCancel}>
          <ModalForm onSubmit={handleSubmit} onCancel={handleCancel}>
            <ModalInput
              label="Фамилия:"
              name="lastName"
              value={formState.lastName}
              onChange={(e) => handleChange('lastName', e.target.value)}
            />
            <ModalInput
              label="Имя:"
              name="firstName"
              value={formState.firstName}
              onChange={(e) => handleChange('firstName', e.target.value)}
            />
            <ModalInput
              label="Отчество:"
              name="middleName"
              value={formState.middleName}
              onChange={(e) => handleChange('middleName', e.target.value)}
            />
            <ModalInput
              label="Титул:"
              name="title"
              value={formState.title}
              onChange={(e) => handleChange('title', e.target.value)}
            />
          </ModalForm>
        </Modal>
      )}
    </div>
  )
}
