import * as style from './style.module.scss'
import { useParams, useNavigate } from 'react-router-dom'
import { useCallback, useReducer } from 'react'
import routes from '@/shared/routes'
import { MultiSelect } from '@/entities/multi-select'
import { ClassroomsSchedule } from '@/widgets/classrooms-schedule'
import { useGetAllClassroomsQuery } from '@/shared/redux/slices/api/classroomsApi'

const idsReducer = (state: string[], action: { type: string; payload?: string | string[] }) => {
  switch (action.type) {
    case 'ADD':
      return action.payload && typeof action.payload === 'string' && !state.includes(action.payload)
        ? [...state, action.payload]
        : state
    case 'REMOVE':
      return action.payload && typeof action.payload === 'string'
        ? state.filter((id) => id !== action.payload)
        : state
    case 'SET':
      return Array.isArray(action.payload) ? action.payload : []
    default:
      return state
  }
}

export const ClassroomsSchedulePage = () => {
  const { classroomsIDs = '' } = useParams()
  const navigate = useNavigate()
  const classroomsIDsArray = classroomsIDs ? classroomsIDs.split(',') : []

  const { data: classroomsData } = useGetAllClassroomsQuery()

  const [classroomsList, dispatchClassroomsList] = useReducer(idsReducer, classroomsIDsArray)

  const selectOptions =
    classroomsData?.map((classroom) => ({
      value: classroom._id,
      label: `${classroom.name} (${classroom.capacity})`,
    })) || []

  const handleChange = useCallback((selectedIds: string[]) => {
    dispatchClassroomsList({ type: 'SET', payload: selectedIds })
  }, [])

  return (
    <div className={style.container}>
      <div className={style.content}>
        <div className={style.wrapper}>
          <div className={`${style.selectContainer} ${!classroomsIDs ? style.column : ''}`}>
            <MultiSelect
              defaultValue={classroomsIDsArray}
              options={selectOptions}
              onChange={handleChange}
              alwaysOpen={!classroomsIDs}
              key={classroomsIDs}
            />

            <button
              onClick={() =>
                navigate(`${routes.CLASSROOMS_SCHEDULE_PATH}/${classroomsList.join(',')}`)
              }
              className={style.doneButton}
            >
              Готово
            </button>
          </div>

          {classroomsIDs && <ClassroomsSchedule classroomsIDs={classroomsIDs} />}
        </div>
      </div>
    </div>
  )
}
