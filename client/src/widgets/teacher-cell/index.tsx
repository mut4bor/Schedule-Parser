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

  const handleCancel = () => {
    setIsModalOpen(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const formData = new FormData(e.target as HTMLFormElement)
    const firstName = formData.get('firstName') as string
    const lastName = formData.get('lastName') as string
    const middleName = formData.get('middleName') as string
    const title = formData.get('title') as string

    if (!firstName || !lastName || !middleName || !title) return

    try {
      await onUpdate({
        id: teacher._id,
        firstName,
        middleName,
        lastName,
        title,
      })
    } catch (err) {
      console.error('Ошибка при создании учителя:', err)
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
              defaultValue={teacher?.lastName ? teacher.lastName : ''}
            />
            <ModalInput
              label="Имя:"
              name="firstName"
              defaultValue={teacher?.firstName ? teacher.firstName : ''}
            />
            <ModalInput
              label="Отчество:"
              name="middleName"
              defaultValue={teacher?.middleName ? teacher.middleName : ''}
            />
            <ModalInput
              label="Титул:"
              name="title"
              defaultValue={teacher?.title ? teacher.title : ''}
            />
          </ModalForm>
        </Modal>
      )}
    </div>
  )
}
