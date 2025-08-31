import * as style from './style.module.scss'
import { Skeleton } from '@/shared/ui'
import { FacultyLink } from '@/entities/faculty'
import { Fragment, useState } from 'react'
import { InlineEdit, EditDeleteActions, AdminAddButton } from '@/entities/admin'

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
  const [isAddingFaculty, setIsAddingFaculty] = useState(false)

  const { educationType, faculties } = data || {}

  const handleEditEducationType = () => {
    if (!educationType) return
    setEditingEducationType(educationType)
    setIsEditingEducationType(true)
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
  }

  const handleEditFaculty = (faculty: string) => {
    setEditingFaculty(faculty)
    setEditingFacultyValue(faculty)
  }

  const handleDeleteFaculty = async (faculty: string) => {
    if (!educationType || !crudHandlers?.onDeleteFaculty) return

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
              <InlineEdit
                initialValue={editingEducationType}
                onSave={async (newValue) => {
                  if (!educationType || !crudHandlers?.onUpdateEducationType)
                    return
                  await crudHandlers.onUpdateEducationType(
                    educationType,
                    newValue,
                  )
                  setIsEditingEducationType(false)
                  setEditingEducationType('')
                }}
                onCancel={() => {
                  setIsEditingEducationType(false)
                  setEditingEducationType('')
                }}
                isLight
              />
            ) : (
              <>
                <h2 className={style.educationType}>{educationType}</h2>
                {crudHandlers && (
                  <EditDeleteActions
                    onEdit={handleEditEducationType}
                    onDelete={handleDeleteEducationType}
                  />
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
                    <InlineEdit
                      initialValue={editingFacultyValue}
                      onSave={async (newValue) => {
                        if (!educationType || !crudHandlers?.onUpdateFaculty)
                          return
                        await crudHandlers.onUpdateFaculty(
                          educationType,
                          faculty,
                          newValue,
                        )
                        setEditingFaculty(null)
                        setEditingFacultyValue('')
                      }}
                      onCancel={() => {
                        setEditingFaculty(null)
                        setEditingFacultyValue('')
                      }}
                    />
                  ) : (
                    <div className={style.facultyWithActions}>
                      <FacultyLink
                        faculty={faculty}
                        href={`educationTypes/${educationType}/faculties/${faculty}/courses`}
                      />
                      {crudHandlers && (
                        <EditDeleteActions
                          onEdit={() => handleEditFaculty(faculty)}
                          onDelete={() => handleDeleteFaculty(faculty)}
                        />
                      )}
                    </div>
                  )}
                </div>
                {index < array.length - 1 && <Pipe />}
              </Fragment>
            ))}

            {crudHandlers && (
              <Fragment>
                {faculties.length > 0 && <Pipe />}
                <div className={style.addFacultyContainer}>
                  {isAddingFaculty ? (
                    <InlineEdit
                      initialValue=""
                      onSave={async (newValue) => {
                        if (!educationType || !crudHandlers?.onCreateFaculty)
                          return
                        await crudHandlers.onCreateFaculty(
                          educationType,
                          newValue,
                        )
                        setIsAddingFaculty(false)
                      }}
                      onCancel={() => {
                        setIsAddingFaculty(false)
                      }}
                    />
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
