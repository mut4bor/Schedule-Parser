import * as style from './style.module.scss'
import { Faculty } from '@/widgets/faculty'
import {
  useCreateEducationTypeMutation,
  useGetEducationTypesQuery,
} from '@/shared/redux/slices/api/educationTypesApi'
import { useAppSelector } from '@/shared/redux/hooks'
import { AdminAddButton } from '@/entities/admin'
import { Modal } from '@/widgets/modal'
import { ModalInput } from '@/widgets/modal-input'
import { ModalForm } from '@/widgets/modal-form'
import { useState } from 'react'

export const MainPage = () => {
  const accessToken = useAppSelector((store) => store.auth.accessToken)

  const [isModalOpen, setIsModalOpen] = useState(false)

  const { data: educationTypesData } = useGetEducationTypesQuery()

  const [createEducationType] = useCreateEducationTypeMutation()

  const [formState, setFormState] = useState('')

  const handleCreateEducationType = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    try {
      await createEducationType({
        name: formState,
      })
    } catch (err) {
      console.error('Ошибка при создании типа образования:', err)
      throw err
    }
  }

  const handleCancel = () => {
    setIsModalOpen(false)
  }

  return (
    <div className={style.container}>
      <ul className={style.list}>
        {!educationTypesData
          ? Array.from({ length: 3 }).map((_, index) => (
              <Faculty columnsAmount={4 - index} key={index} />
            ))
          : educationTypesData.map((educationType, index) => (
              <Faculty educationType={educationType} key={index} />
            ))}
      </ul>

      {accessToken && (
        <AdminAddButton onClick={() => setIsModalOpen(true)}>Добавить тип обучения</AdminAddButton>
      )}

      {isModalOpen && (
        <Modal onClose={handleCancel}>
          <ModalForm onSubmit={handleCreateEducationType} onCancel={handleCancel}>
            <ModalInput
              label="Добавить тип обучения:"
              name="educationType"
              value={formState}
              onChange={(e) => setFormState(e.target.value)}
            />
          </ModalForm>
        </Modal>
      )}
    </div>
  )
}
