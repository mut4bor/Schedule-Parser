import * as style from './style.module.scss'
import { Faculty } from '@/widgets/faculty'
import { useCreateEducationTypeMutation } from '@/shared/redux/slices/api/educationTypesApi'
import { useGetFacultiesQuery } from '@/shared/redux/slices/api/facultiesApi'
import { useAppSelector } from '@/shared/redux/hooks'
import { AddItem } from '@/widgets/add-item'
import { Modal } from '@/widgets/modal'
import { ModalInput } from '@/widgets/modal-input'
import { ModalForm } from '@/widgets/modal-form'
import { useState } from 'react'

export const MainPage = () => {
  const accessToken = useAppSelector((store) => store.auth.accessToken)

  const [isModalOpen, setIsModalOpen] = useState(false)

  const {
    data: facultiesData,
    isLoading: isFacultiesLoading,
    error: facultiesError,
  } = useGetFacultiesQuery()

  const [createEducationType] = useCreateEducationTypeMutation()

  const handleCreateEducationType = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    try {
      const formData = new FormData(e.target as HTMLFormElement)
      const educationType = formData.get('educationType') as string
      await createEducationType({
        educationType: educationType,
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
      {!facultiesError && (
        <ul className={style.list}>
          {!facultiesData || isFacultiesLoading
            ? Array.from({ length: 3 }).map((_, index) => (
                <Faculty columnsAmount={4 - index} key={index} />
              ))
            : Object.entries(facultiesData)
                .sort(([a], [b]) => {
                  const order = ['бакалавриат', 'магистратура', 'аспирантура']
                  const aIndex = order.indexOf(a.toLowerCase())
                  const bIndex = order.indexOf(b.toLowerCase())
                  if (aIndex === -1 && bIndex === -1) {
                    return a.localeCompare(b, 'ru')
                  }
                  if (aIndex === -1) return 1
                  if (bIndex === -1) return -1
                  return aIndex - bIndex
                })
                .map(([educationType, faculties], key) => (
                  <Faculty key={key} data={{ educationType, faculties }} />
                ))}
        </ul>
      )}

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
