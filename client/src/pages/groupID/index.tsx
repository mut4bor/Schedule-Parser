import * as style from './style.module.scss'
import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { GroupNavigation, GroupButtonList } from '@/entities/group'
import { getDaysInRange, getCurrentWeekRange } from '@/shared/hooks'
import { useGetGroupByIDQuery, useAppDispatch, useAppSelector, navigationValueChanged } from '@/shared/redux'

export const GroupIDPage = () => {
  const dispatch = useAppDispatch()
  const { groupID } = useParams()
  const { data: groupData, error: groupError } = useGetGroupByIDQuery(groupID ?? '')

  const { monday, saturday } = getCurrentWeekRange()
  const range = `${monday}-${saturday}`

  const picked = useAppSelector((store) => store.navigation.navigationValue)

  useEffect(() => {
    if (groupData) {
      const scheduleKeys = Object.keys(groupData.dates)
      const daysRange = scheduleKeys.map((item) => getDaysInRange(item))
      const currentWeekIndex = daysRange.findIndex(
        (subArray) => subArray.includes(monday) && subArray.includes(saturday),
      )
      const currentWeek = scheduleKeys[currentWeekIndex]
      if (currentWeek) {
        const currentDate = new Date()
        const today = Object.keys(groupData.dates[currentWeek]).find((date) =>
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
  }, [groupData, dispatch, range, groupID])
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
