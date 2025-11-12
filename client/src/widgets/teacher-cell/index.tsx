import * as style from './style.module.scss'
import { useState } from 'react'
import { ITeacher, UpdateTeacherDTO, DeleteTeacherDTO } from '@/shared/redux/slices/api/teachersApi'
import { useAppSelector } from '@/shared/redux/hooks'
import { Modal } from '@/widgets/modal'
import { ModalForm } from '@/widgets/modal-form'
import { ModalInput } from '@/widgets/modal-input'
import { EditDeleteActions } from '@/entities/admin'

interface Props {
  teacher: ITeacher
  onUpdate: (args: UpdateTeacherDTO) => Promise<void>
  onDelete: (args: DeleteTeacherDTO) => Promise<void>
}

export const TeacherCell = ({ teacher, onUpdate, onDelete }: Props) => {
  const accessToken = useAppSelector((store) => store.auth.accessToken)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const [formState, setFormState] = useState({
    lastName: teacher.lastName || '',
    firstName: teacher.firstName || '',
    middleName: teacher.middleName || '',
    title: teacher.title || '',
  })

  const handleChange = (field: keyof typeof formState, value: string) => {
    setFormState((prev) => ({ ...prev, [field]: value }))
  }

  const handleCancel = () => {
    setFormState({
      lastName: teacher.lastName || '',
      firstName: teacher.firstName || '',
      middleName: teacher.middleName || '',
      title: teacher.title || '',
    })
    setIsModalOpen(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const { firstName, lastName, middleName, title } = formState

    if (!firstName || !lastName || !middleName || !title) {
      console.warn('Все поля обязательны для заполнения.')
      return
    }

    try {
      await onUpdate({
        id: teacher._id,
        firstName,
        lastName,
        middleName,
        title,
      })
      setIsModalOpen(false)
    } catch (err) {
      console.error('Ошибка при обновлении учителя:', err)
    }
  }

  return (
    <div className={style.container}>
      <p className={style.text}>
        {teacher.lastName} {teacher.firstName} {teacher.middleName} ({teacher.title})
      </p>

      {accessToken && (
        <EditDeleteActions
          onEdit={() => setIsModalOpen(true)}
          onDelete={() => onDelete({ id: teacher._id })}
        />
      )}

      {accessToken && isModalOpen && (
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
