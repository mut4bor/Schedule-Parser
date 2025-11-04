import * as style from './style.module.scss'
import { Faculty } from '@/widgets/faculty'
import {
  useCreateEducationTypeMutation,
  useGetEducationTypesQuery,
} from '@/shared/redux/slices/api/educationTypesApi'
import { useAppSelector } from '@/shared/redux/hooks'
import { AddItem } from '@/widgets/add-item'
import { Modal } from '@/widgets/modal'
import { ModalInput } from '@/widgets/modal-input'
import { ModalForm } from '@/widgets/modal-form'
import { useState } from 'react'

export const MainPage = () => {
  const accessToken = useAppSelector((store) => store.auth.accessToken)

  const [isModalOpen, setIsModalOpen] = useState(false)

  const { data: educationTypesData } = useGetEducationTypesQuery()

  const [createEducationType] = useCreateEducationTypeMutation()

  const handleCreateEducationType = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    try {
      const formData = new FormData(e.target as HTMLFormElement)
      const educationType = formData.get('educationType') as string
      await createEducationType({
        name: educationType,
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
        <AddItem
          addButtonLabel="Добавить тип обучения"
          isAdding={isModalOpen}
          setIsAdding={setIsModalOpen}
        >
          <Modal onClose={handleCancel}>
            <ModalForm onSubmit={handleCreateEducationType} onCancel={handleCancel}>
              <ModalInput label="Добавить тип обучения:" name="educationType" defaultValue="" />
            </ModalForm>
          </Modal>
        </AddItem>
      )}
    </div>
  )
}
