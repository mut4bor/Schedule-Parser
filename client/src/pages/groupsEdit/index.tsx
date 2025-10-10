import * as style from './style.module.scss'
import { useParams, useNavigate } from 'react-router-dom'
import { useAppSelector, useGetGroupNamesQuery } from '@/shared/redux'
import { useCallback, useReducer } from 'react'
import routes from '@/shared/routes'
import { MultiSelect } from '@/entities/multi-select'
import { ScheduleAdmin } from '@/widgets/schedule-admin'

const groupListReducer = (
  state: string[],
  action: { type: string; payload?: string | string[] },
) => {
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

export const GroupsEditPage = () => {
  const { groupsIDs = '' } = useParams()
  const navigate = useNavigate()
  const groupsIdsArray = groupsIDs ? groupsIDs.split(',') : []

  const accessToken = useAppSelector((store) => store.auth.accessToken)
  const { data: groupNamesData } = useGetGroupNamesQuery()

  const [groupList, dispatchGroupList] = useReducer(groupListReducer, groupsIdsArray)

  const selectOptions =
    groupNamesData?.map((item) => ({
      value: item._id,
      label: item.group,
    })) || []

  const handleChange = useCallback((selectedIds: string[]) => {
    dispatchGroupList({ type: 'SET', payload: selectedIds })
  }, [])

  if (!accessToken) {
    return null
  }

  return (
    <div className={style.container}>
      <div className={style.content}>
        <div className={style.wrapper}>
          <div className={`${style.selectContainer} ${!groupsIDs ? style.column : ''}`}>
            <MultiSelect
              defaultValue={groupsIdsArray}
              options={selectOptions}
              onChange={handleChange}
              alwaysOpen={!groupsIDs}
              key={groupsIDs}
            />

            <button
              onClick={() => {
                const joined = groupList.join(',')
                navigate(`${routes.GROUPS_EDIT_PATH}/${joined}`)
              }}
              className={style.doneButton}
            >
              Готово
            </button>
          </div>

          {groupsIDs && <ScheduleAdmin groupsIDs={groupsIDs} />}
        </div>
      </div>
    </div>
  )
}
