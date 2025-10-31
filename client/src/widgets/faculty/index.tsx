import * as style from './style.module.scss'
import { Skeleton } from '@/shared/ui'
import { FacultyLink } from '@/entities/faculty'
import { Fragment, useState } from 'react'
import { EditableItem } from '@/widgets/editable-item'
import { AddItem } from '../add-item'
import { Modal } from '../modal'
import { ModalForm } from '../modal-form'
import { ModalInput } from '../modal-input'
import {
  useCreateFacultyMutation,
  useUpdateFacultyMutation,
  useDeleteFacultyMutation,
  useUpdateEducationTypeMutation,
  useDeleteEducationTypeMutation,
  useAppSelector,
} from '@/shared/redux'

const Pipe = () => {
  return <span className={style.pipe}></span>
}

interface Props {
  data?: {
    educationType: string
    faculties: string[]
  }
  columnsAmount?: number
}

export const Faculty = ({ data, columnsAmount }: Props) => {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const { educationType, faculties } = data || {}

  const skeletonLength = columnsAmount ? (columnsAmount > 0 ? columnsAmount : 1) : 4

  const accessToken = useAppSelector((store) => store.auth.accessToken)

  const [updateEducationType] = useUpdateEducationTypeMutation()
  const [deleteEducationType] = useDeleteEducationTypeMutation()

  const [createFaculty] = useCreateFacultyMutation()
  const [updateFaculty] = useUpdateFacultyMutation()
  const [deleteFaculty] = useDeleteFacultyMutation()

  const handleUpdateEducationType = async (oldType: string, newType: string) => {
    try {
      await updateEducationType({
        oldEducationType: oldType,
        newEducationType: newType,
      }).unwrap()
    } catch (err) {
      console.error('Ошибка при обновлении типа образования:', err)
      throw err
    }
  }

  const handleDeleteEducationType = async (educationType: string) => {
    try {
      await deleteEducationType(educationType).unwrap()
    } catch (err) {
      console.error('Ошибка при удалении типа образования:', err)
      throw err
    }
  }

  const handleCreateFaculty = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const formData = new FormData(e.target as HTMLFormElement)
    const faculty = formData.get('faculty') as string

    try {
      await createFaculty({
        educationType: educationType || '',
        faculty,
      }).unwrap()
    } catch (err) {
      console.error('Ошибка при создании факультета:', err)
      throw err
    }
  }

  const handleUpdateFaculty = async (
    educationType: string,
    oldFaculty: string,
    newFaculty: string,
  ) => {
    try {
      await updateFaculty({
        educationType,
        oldFaculty,
        newFaculty,
      }).unwrap()
    } catch (err) {
      console.error('Ошибка при обновлении факультета:', err)
      throw err
    }
  }

  const handleDeleteFaculty = async (educationType: string, faculty: string) => {
    try {
      await deleteFaculty({ educationType, faculty }).unwrap()
    } catch (err) {
      console.error('Ошибка при удалении факультета:', err)
      throw err
    }
  }

  const handleCancel = () => {
    setIsModalOpen(false)
  }

  return (
    <li className={style.container}>
      <div className={style.heading}>
        {!educationType || !faculties ? (
          <Skeleton />
        ) : (
          <div className={style.educationTypeHeader}>
            <EditableItem
              value={educationType}
              crudHandlers={{
                onUpdate: (oldValue, newValue) => handleUpdateEducationType(oldValue, newValue),
                onDelete: (value) => handleDeleteEducationType(value),
              }}
              className={style.educationType}
            >
              <h2 className={style.educationType}>{educationType}</h2>
            </EditableItem>
          </div>
        )}
      </div>

      <ul className={style.content}>
        {!data || !educationType || !faculties ? (
          Array.from({ length: skeletonLength }).map((_, index, array) => (
            <Fragment key={`skeleton-${index}`}>
              <div className={style.skeletonContainer}>
                <ul className={style.skeletonList}>
                  {Array.from({ length: 3 }).map((_, index) => (
                    <li key={index}>
                      <Skeleton />
                    </li>
                  ))}
                </ul>
              </div>
              {index < array.length - 1 && <Pipe />}
            </Fragment>
          ))
        ) : (
          <>
            {faculties.map((faculty, index, array) => (
              <Fragment key={`faculty-${index}`}>
                <li className={style.facultyItem}>
                  <EditableItem
                    value={faculty}
                    crudHandlers={{
                      onUpdate: (oldValue, newValue) =>
                        handleUpdateFaculty(educationType, oldValue, newValue),
                      onDelete: (value) => handleDeleteFaculty(educationType, value),
                    }}
                    className={style.facultyWithActions}
                  >
                    <FacultyLink
                      faculty={faculty}
                      href={`/educationTypes/${educationType}/faculties/${faculty}/courses`}
                    />
                  </EditableItem>
                </li>
                {index < array.length - 1 && <Pipe />}
              </Fragment>
            ))}

            {accessToken && (
              <Fragment>
                {faculties.length > 0 && <Pipe />}
                <div>
                  <AddItem
                    addButtonLabel="Добавить факультет"
                    isAdding={isModalOpen}
                    setIsAdding={setIsModalOpen}
                  >
                    <Modal onClose={handleCancel}>
                      <ModalForm onSubmit={handleCreateFaculty} onCancel={handleCancel}>
                        <ModalInput
                          label="Добавить факультет:"
                          name="faculty"
                          defaultValue=""
                          type="text"
                        />
                      </ModalForm>
                    </Modal>
                  </AddItem>
                </div>
              </Fragment>
            )}
          </>
        )}
      </ul>
    </li>
  )
}
