import * as style from './style.module.scss'
import { Skeleton } from '@/shared/ui'
import { FacultyLink } from '@/entities/faculty'
import { Fragment, useState } from 'react'
import { EditableItem } from '@/widgets/editable-item'
import { AdminAddButton } from '@/entities/admin'
import { Modal } from '../modal'
import { ModalForm } from '../modal-form'
import { ModalInput } from '../modal-input'
import {
  useUpdateEducationTypeMutation,
  useDeleteEducationTypeMutation,
  EducationType,
  UpdateEducationTypeDTO,
  DeleteEducationTypeDTO,
} from '@/shared/redux/slices/api/educationTypesApi'
import {
  useCreateFacultyMutation,
  useUpdateFacultyMutation,
  useDeleteFacultyMutation,
  useGetFacultiesQuery,
  UpdateFacultyDTO,
  DeleteFacultyDTO,
} from '@/shared/redux/slices/api/facultiesApi'
import { useAppSelector } from '@/shared/redux/hooks'

const Pipe = () => {
  return <span className={style.pipe}></span>
}

interface Props {
  educationType?: EducationType
  columnsAmount?: number
}

export const Faculty = ({ educationType, columnsAmount }: Props) => {
  const { data: facultiesData } = useGetFacultiesQuery(educationType?._id)

  const [isModalOpen, setIsModalOpen] = useState(false)

  const skeletonLength = columnsAmount ? (columnsAmount > 0 ? columnsAmount : 1) : 4

  const accessToken = useAppSelector((store) => store.auth.accessToken)

  const [updateEducationType] = useUpdateEducationTypeMutation()
  const [deleteEducationType] = useDeleteEducationTypeMutation()

  const [createFaculty] = useCreateFacultyMutation()
  const [updateFaculty] = useUpdateFacultyMutation()
  const [deleteFaculty] = useDeleteFacultyMutation()

  const [formState, setFormState] = useState('')

  const handleUpdateEducationType = async (args: UpdateEducationTypeDTO) => {
    try {
      await updateEducationType(args).unwrap()
    } catch (err) {
      console.error('Ошибка при обновлении типа образования:', err)
      throw err
    }
  }

  const handleDeleteEducationType = async (args: DeleteEducationTypeDTO) => {
    try {
      await deleteEducationType(args).unwrap()
    } catch (err) {
      console.error('Ошибка при удалении типа образования:', err)
      throw err
    }
  }

  const handleCreateFaculty = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!educationType) {
      return
    }

    try {
      await createFaculty({
        educationType: educationType._id,
        name: formState,
      }).unwrap()
    } catch (err) {
      console.error('Ошибка при создании факультета:', err)
      throw err
    }
  }

  const handleUpdateFaculty = async (args: UpdateFacultyDTO) => {
    try {
      await updateFaculty(args).unwrap()
    } catch (err) {
      console.error('Ошибка при обновлении факультета:', err)
      throw err
    }
  }

  const handleDeleteFaculty = async (args: DeleteFacultyDTO) => {
    try {
      await deleteFaculty(args).unwrap()
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
        {!educationType ? (
          <Skeleton />
        ) : (
          <div className={style.educationTypeHeader}>
            <EditableItem
              value={educationType.name}
              crudHandlers={{
                onUpdate: (newValue) =>
                  handleUpdateEducationType({ id: educationType._id, name: newValue }),
                onDelete: () => handleDeleteEducationType({ id: educationType._id }),
              }}
              className={style.educationType}
            >
              <h2 className={style.educationType}>{educationType.name}</h2>
            </EditableItem>
          </div>
        )}
      </div>

      <ul className={style.content}>
        {!educationType || !facultiesData ? (
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
            {facultiesData.map((faculty, index, array) => (
              <Fragment key={`faculty-${index}`}>
                <li className={style.facultyItem}>
                  <EditableItem
                    value={faculty.name}
                    crudHandlers={{
                      onUpdate: (newValue) =>
                        handleUpdateFaculty({ id: faculty._id, name: newValue }),
                      onDelete: () => handleDeleteFaculty({ id: faculty._id }),
                    }}
                    className={style.facultyWithActions}
                  >
                    <FacultyLink
                      faculty={faculty.name}
                      href={`/educationTypes/${educationType._id}/faculties/${faculty._id}/courses`}
                    />
                  </EditableItem>
                </li>
                {index < array.length - 1 && <Pipe />}
              </Fragment>
            ))}

            {accessToken && (
              <Fragment>
                {facultiesData.length > 0 && <Pipe />}
                <div>
                  <AdminAddButton onClick={() => setIsModalOpen(true)}>
                    Добавить факультет
                  </AdminAddButton>
                </div>
              </Fragment>
            )}
          </>
        )}
      </ul>

      {isModalOpen && (
        <Modal onClose={handleCancel}>
          <ModalForm onSubmit={handleCreateFaculty} onCancel={handleCancel}>
            <ModalInput
              label="Добавить факультет:"
              name="faculty"
              value={formState}
              onChange={(e) => setFormState(e.target.value)}
              type="text"
            />
          </ModalForm>
        </Modal>
      )}
    </li>
  )
}
