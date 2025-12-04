import * as style from './style.module.scss'
import { useParams, useNavigate } from 'react-router-dom'
import { useCallback, useReducer } from 'react'
import routes from '@/shared/routes'
import { MultiSelect } from '@/entities/multi-select'
import { TeachersSchedule } from '@/widgets/teachers-schedule'
import { useGetAllTeachersQuery } from '@/shared/redux/slices/api/teachersApi'

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

export const TeachersSchedulePage = () => {
  const { teachersIDs = '' } = useParams()
  const navigate = useNavigate()
  const teacherIdsArray = teachersIDs ? teachersIDs.split(',') : []

  const { data: teachersData } = useGetAllTeachersQuery()

  const [teacherList, dispatchTeacherList] = useReducer(idsReducer, teacherIdsArray)

  const selectOptions =
    teachersData?.map((t) => ({
      value: t._id,
      label: `${t.firstName} ${t.middleName} ${t.lastName} (${t.title})`,
    })) || []

  const handleChange = useCallback((selectedIds: string[]) => {
    dispatchTeacherList({ type: 'SET', payload: selectedIds })
  }, [])

  return (
    <div className={style.container}>
      <div className={style.content}>
        <div className={style.wrapper}>
          <div className={`${style.selectContainer} ${!teachersIDs ? style.column : ''}`}>
            <MultiSelect
              defaultValue={teacherIdsArray}
              options={selectOptions}
              onChange={handleChange}
              alwaysOpen={!teachersIDs}
              key={teachersIDs}
            />

            <button
              onClick={() => navigate(`${routes.TEACHERS_SCHEDULE_PATH}/${teacherList.join(',')}`)}
              className={style.doneButton}
            >
              Готово
            </button>
          </div>

          {teachersIDs && <TeachersSchedule teachersIDs={teachersIDs} />}
        </div>
      </div>
    </div>
  )
}
