import * as style from './style.module.scss'
import { Skeleton } from '@/shared/ui'
import { FacultyLink } from '@/entities/faculty'
import { Fragment, useState } from 'react'
import { AdminAddButton } from '@/entities/admin/addButton'

const Pipe = () => {
  return <span className={style.pipe}></span>
}

type CrudHandlers = {
  onUpdateEducationType?: (oldType: string, newType: string) => Promise<void>
  onDeleteEducationType?: (educationType: string) => Promise<void>
  onCreateFaculty?: (educationType: string, faculty: string) => Promise<void>
  onUpdateFaculty?: (
    educationType: string,
    oldFaculty: string,
    newFaculty: string,
  ) => Promise<void>
  onDeleteFaculty?: (educationType: string, faculty: string) => Promise<void>
}

type Props = {
  data?: {
    educationType: string
    faculties: string[]
  }
  columnsAmount?: number
  crudHandlers?: CrudHandlers
}

export const Faculty = ({ data, columnsAmount, crudHandlers }: Props) => {
  const [isEditingEducationType, setIsEditingEducationType] = useState(false)
  const [editingEducationType, setEditingEducationType] = useState('')
  const [editingFaculty, setEditingFaculty] = useState<string | null>(null)
  const [editingFacultyValue, setEditingFacultyValue] = useState('')
  const [newFaculty, setNewFaculty] = useState('')
  const [isAddingFaculty, setIsAddingFaculty] = useState(false)

  const { educationType, faculties } = data || {}

  const handleEditEducationType = () => {
    if (!educationType) return
    setEditingEducationType(educationType)
    setIsEditingEducationType(true)
  }

  const handleSaveEducationType = async () => {
    if (
      !educationType ||
      !editingEducationType ||
      !crudHandlers?.onUpdateEducationType
    )
      return
    try {
      await crudHandlers.onUpdateEducationType(
        educationType,
        editingEducationType,
      )
      setIsEditingEducationType(false)
      setEditingEducationType('')
    } catch (err) {
      console.error('Ошибка при обновлении типа образования:', err)
    }
  }

  const handleCancelEditEducationType = () => {
    setIsEditingEducationType(false)
    setEditingEducationType('')
  }

  const handleDeleteEducationType = async () => {
    if (!educationType || !crudHandlers?.onDeleteEducationType) return
    if (window.confirm(`Удалить тип образования "${educationType}"?`)) {
      try {
        await crudHandlers.onDeleteEducationType(educationType)
      } catch (err) {
        console.error('Ошибка при удалении типа образования:', err)
      }
    }
  }

  const handleAddFaculty = () => {
    setIsAddingFaculty(true)
    setNewFaculty('')
  }

  const handleSaveNewFaculty = async () => {
    if (!educationType || !newFaculty || !crudHandlers?.onCreateFaculty) return
    try {
      await crudHandlers.onCreateFaculty(educationType, newFaculty)
      setIsAddingFaculty(false)
      setNewFaculty('')
    } catch (err) {
      console.error('Ошибка при создании факультета:', err)
    }
  }

  const handleCancelAddFaculty = () => {
    setIsAddingFaculty(false)
    setNewFaculty('')
  }

  const handleEditFaculty = (faculty: string) => {
    setEditingFaculty(faculty)
    setEditingFacultyValue(faculty)
  }

  const handleSaveFaculty = async (oldFaculty: string) => {
    if (
      !educationType ||
      !editingFacultyValue ||
      !crudHandlers?.onUpdateFaculty
    )
      return
    try {
      await crudHandlers.onUpdateFaculty(
        educationType,
        oldFaculty,
        editingFacultyValue,
      )
      setEditingFaculty(null)
      setEditingFacultyValue('')
    } catch (err) {
      console.error('Ошибка при обновлении факультета:', err)
    }
  }

  const handleCancelEditFaculty = () => {
    setEditingFaculty(null)
    setEditingFacultyValue('')
  }

  const handleDeleteFaculty = async (faculty: string) => {
    if (!educationType || !crudHandlers?.onDeleteFaculty) return

    console.log('educationType', educationType)
    console.log('faculty', faculty)

    if (window.confirm(`Удалить факультет "${faculty}"?`)) {
      try {
        await crudHandlers.onDeleteFaculty(educationType, faculty)
      } catch (err) {
        console.error('Ошибка при удалении факультета:', err)
      }
    }
  }

  const skeletonLength = columnsAmount
    ? columnsAmount > 0
      ? columnsAmount
      : 1
    : 4

  return (
    <div className={style.container}>
      <div className={style.heading}>
        {!data ? (
          <Skeleton />
        ) : (
          <div className={style.educationTypeHeader}>
            {isEditingEducationType ? (
              <div className={style.editForm}>
                <input
                  type="text"
                  value={editingEducationType}
                  onChange={(e) => setEditingEducationType(e.target.value)}
                  className={`${style.editInput} ${style.isLight}`}
                />
                <button
                  onClick={handleSaveEducationType}
                  className={`${style.saveButton} ${style.isLight}`}
                >
                  ✓
                </button>
                <button
                  onClick={handleCancelEditEducationType}
                  className={`${style.cancelButton} ${style.isLight}`}
                >
                  ✕
                </button>
              </div>
            ) : (
              <>
                <h2 className={style.educationType}>{educationType}</h2>
                {crudHandlers && (
                  <div className={style.educationTypeActions}>
                    <button
                      onClick={handleEditEducationType}
                      className={style.editButton}
                    >
                      ✏️
                    </button>
                    <button
                      onClick={handleDeleteEducationType}
                      className={style.deleteButton}
                    >
                      🗑️
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>

      <div className={style.content}>
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
                <div className={style.facultyItem}>
                  {editingFaculty === faculty ? (
                    <div className={style.editForm}>
                      <input
                        type="text"
                        value={editingFacultyValue}
                        onChange={(e) => setEditingFacultyValue(e.target.value)}
                        className={style.editInput}
                      />
                      <button
                        onClick={() => handleSaveFaculty(faculty)}
                        className={style.saveButton}
                      >
                        ✓
                      </button>
                      <button
                        onClick={handleCancelEditFaculty}
                        className={style.cancelButton}
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <div className={style.facultyWithActions}>
                      <FacultyLink
                        faculty={faculty}
                        href={`educationTypes/${educationType}/faculties/${faculty}/courses`}
                      />
                      {crudHandlers && (
                        <div className={style.facultyActions}>
                          <button
                            onClick={() => handleEditFaculty(faculty)}
                            className={style.editButton}
                          >
                            ✏️
                          </button>
                          <button
                            onClick={() => handleDeleteFaculty(faculty)}
                            className={style.deleteButton}
                          >
                            🗑️
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                {index < array.length - 1 && <Pipe />}
              </Fragment>
            ))}

            {/* Добавление нового факультета */}
            {crudHandlers && (
              <Fragment>
                {faculties.length > 0 && <Pipe />}
                <div className={style.addFacultyContainer}>
                  {isAddingFaculty ? (
                    <div className={style.editForm}>
                      <input
                        type="text"
                        value={newFaculty}
                        onChange={(e) => setNewFaculty(e.target.value)}
                        placeholder="Название факультета"
                        className={style.editInput}
                      />
                      <button
                        onClick={handleSaveNewFaculty}
                        className={style.saveButton}
                      >
                        ✓
                      </button>
                      <button
                        onClick={handleCancelAddFaculty}
                        className={style.cancelButton}
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <AdminAddButton onClick={handleAddFaculty}>
                      Добавить факультет
                    </AdminAddButton>
                  )}
                </div>
              </Fragment>
            )}
          </>
        )}
      </div>
    </div>
  )
}
