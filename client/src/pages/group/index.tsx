import * as style from './style.module.scss'
import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { GroupNavigation, GroupButtonList } from '@/entities/group'
import { getCurrentWeekRange } from '@/shared/hooks/getCurrentWeekRange'
import { useGetGroupByIDQuery, useAppDispatch, useAppSelector, navigationValueChanged } from '@/shared/redux'

export const GroupPage = () => {
  const dispatch = useAppDispatch()
  const { groupId } = useParams()
  const { data: groupData, error: groupError } = useGetGroupByIDQuery(groupId ?? '')

  const { firstDay, lastDay } = getCurrentWeekRange()
  const range = `${firstDay}-${lastDay}`

  const picked = useAppSelector((store) => store.navigation.navigationValue)

  useEffect(() => {
    if (groupData) {
      const currentWeek = Object.keys(groupData.date).find((date) => date.includes(firstDay))

      if (currentWeek) {
        const currentDate = new Date()
        const today = Object.keys(groupData.date[currentWeek]).find((date) =>
          date.includes(`${currentDate.getDate()}.${String(currentDate.getMonth() + 1).padStart(2, '0')}.`),
        )
        if (today) {
          dispatch(navigationValueChanged({ ...picked, group: groupData._id, week: currentWeek, day: today }))
          return
        }
        dispatch(navigationValueChanged({ ...picked, group: groupData._id, week: currentWeek }))
        return
      }
      dispatch(navigationValueChanged({ ...picked, group: groupData._id }))
    }
  }, [groupData, dispatch, firstDay, range, groupId])

  if (!groupData) {
    return <div className=""></div>
  }

  return (
    <div className={style.container}>
      <GroupNavigation />
      <GroupButtonList />
    </div>
  )
}
