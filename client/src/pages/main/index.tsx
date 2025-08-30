import * as style from './style.module.scss'
import { Faculty } from '@/widgets/faculty'
import {
  useGetFacultiesQuery,
  useCreateFacultyMutation,
  useUpdateFacultyMutation,
  useDeleteFacultyMutation,
  useCreateEducationTypeMutation,
  useUpdateEducationTypeMutation,
  useDeleteEducationTypeMutation,
} from '@/shared/redux'
import { ErrorComponent } from '@/widgets/error'

export const MainPage = () => {
  const { data: facultiesData, error: facultiesError } = useGetFacultiesQuery()

  const [createEducationType] = useCreateEducationTypeMutation()
  const [updateEducationType] = useUpdateEducationTypeMutation()
  const [deleteEducationType] = useDeleteEducationTypeMutation()

  const [createFaculty] = useCreateFacultyMutation()
  const [updateFaculty] = useUpdateFacultyMutation()
  const [deleteFaculty] = useDeleteFacultyMutation()

  if (facultiesError) {
    return <ErrorComponent error={facultiesError} hideMainPageButton />
  }

  const handleCreateEducationType = async () => {
    const newType = prompt('Введите название нового типа образования:')
    if (!newType) return
    try {
      await createEducationType({
        educationType: newType,
        faculty: '123',
        course: '1',
        group: 'Группа-1',
      }).unwrap()
    } catch (err) {
      console.error('Ошибка при создании типа образования:', err)
      throw err
    }
  }

  const handleUpdateEducationType = async (
    oldType: string,
    newType: string,
  ) => {
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

  const handleCreateFaculty = async (
    educationType: string,
    faculty: string,
  ) => {
    try {
      await createFaculty({
        educationType,
        faculty,
        course: '1',
        group: 'Группа-1',
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

  const handleDeleteFaculty = async (
    educationType: string,
    faculty: string,
  ) => {
    try {
      await deleteFaculty({ educationType, faculty }).unwrap()
    } catch (err) {
      console.error('Ошибка при удалении факультета:', err)
      throw err
    }
  }

  const crudHandlers = {
    onUpdateEducationType: handleUpdateEducationType,
    onDeleteEducationType: handleDeleteEducationType,
    onCreateFaculty: handleCreateFaculty,
    onUpdateFaculty: handleUpdateFaculty,
    onDeleteFaculty: handleDeleteFaculty,
  }

  return (
    <div className={style.container}>
      {!facultiesData
        ? Array.from({ length: 3 }).map((_, index) => (
            <Faculty columnsAmount={4 - index} key={index} />
          ))
        : Object.entries(facultiesData).map(
            ([educationType, faculties], key) => (
              <Faculty
                key={key}
                data={{ educationType, faculties }}
                crudHandlers={crudHandlers}
              />
            ),
          )}

      <button className={style.addButton} onClick={handleCreateEducationType}>
        ➕ Добавить тип обучения
      </button>
    </div>
  )
}
