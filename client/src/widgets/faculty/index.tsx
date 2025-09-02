import * as style from './style.module.scss'
import { Skeleton } from '@/shared/ui'
import { FacultyLink } from '@/entities/faculty'
import { Fragment } from 'react'
import { EditableItem } from '@/widgets/editable-item'
import { AddItem } from '../add-item'

const Pipe = () => {
  return <span className={style.pipe}></span>
}

type CrudHandlers = {
  onUpdateEducationType: (oldType: string, newType: string) => Promise<void>
  onDeleteEducationType: (educationType: string) => Promise<void>
  onCreateFaculty: (educationType: string, faculty: string) => Promise<void>
  onUpdateFaculty: (
    educationType: string,
    oldFaculty: string,
    newFaculty: string,
  ) => Promise<void>
  onDeleteFaculty: (educationType: string, faculty: string) => Promise<void>
}

interface Props {
  data?: {
    educationType: string
    faculties: string[]
  }
  columnsAmount?: number
  crudHandlers?: CrudHandlers
}

export const Faculty = ({ data, columnsAmount, crudHandlers }: Props) => {
  const { educationType, faculties } = data || {}

  const skeletonLength = columnsAmount
    ? columnsAmount > 0
      ? columnsAmount
      : 1
    : 4

  return (
    <div className={style.container}>
      <div className={style.heading}>
        {!educationType || !faculties ? (
          <Skeleton />
        ) : (
          <div className={style.educationTypeHeader}>
            <EditableItem
              value={educationType}
              crudHandlers={
                crudHandlers
                  ? {
                      onUpdate: (oldValue, newValue) =>
                        crudHandlers.onUpdateEducationType(oldValue, newValue),
                      onDelete: (value) =>
                        crudHandlers.onDeleteEducationType(value),
                    }
                  : undefined
              }
              className={style.educationType}
            >
              <h2 className={style.educationType}>{educationType}</h2>
            </EditableItem>
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
                  <EditableItem
                    value={faculty}
                    crudHandlers={
                      crudHandlers
                        ? {
                            onUpdate: (oldValue, newValue) =>
                              crudHandlers.onUpdateFaculty(
                                educationType,
                                oldValue,
                                newValue,
                              ),
                            onDelete: (value) =>
                              crudHandlers.onDeleteFaculty(
                                educationType,
                                value,
                              ),
                          }
                        : undefined
                    }
                    className={style.facultyWithActions}
                  >
                    <FacultyLink
                      faculty={faculty}
                      href={`educationTypes/${educationType}/faculties/${faculty}/courses`}
                    />
                  </EditableItem>
                </div>
                {index < array.length - 1 && <Pipe />}
              </Fragment>
            ))}

            {crudHandlers && (
              <Fragment>
                {faculties.length > 0 && <Pipe />}
                <AddItem
                  onAdd={async (newValue) => {
                    if (!educationType) return
                    await crudHandlers.onCreateFaculty(educationType, newValue)
                  }}
                >
                  Добавить факультет
                </AddItem>
              </Fragment>
            )}
          </>
        )}
      </div>
    </div>
  )
}
