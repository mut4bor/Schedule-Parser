import * as style from './style.module.scss'
import { useParams } from 'react-router-dom'
import { GroupSlider } from '@/entities/group/group-slider'
import { GroupDays } from '@/entities/group/group-days'
import { GroupSchedule } from '@/entities/group/group-schedule'
import { navigationValueChanged, useAppDispatch, useAppSelector, useGetGroupByIDQuery } from '@/shared/redux'
import { useEffect } from 'react'

export const GroupIDPage = () => {
  const dispatch = useAppDispatch()
  const navigationValue = useAppSelector((store) => store.navigation.navigationValue)
  const { groupID } = useParams()

  useEffect(() => {
    if (!!groupID) {
      dispatch(navigationValueChanged({ ...navigationValue, group: groupID }))
    }
  }, [groupID, dispatch])

  if (!groupID) {
    return <div className={style.error}>Invalid Group ID</div>
  }

  const { data: groupData, error: groupError, isLoading, isFetching } = useGetGroupByIDQuery(groupID)

  if (!groupData) {
    return <div className={style.error}>Group not found</div>
  }

  return (
    <div className={style.container}>
      <GroupSlider data={groupData} />
      <div className={style.wrapper}>
        <GroupDays data={groupData} />
        <div className={style.schedule}>
          <GroupSchedule data={groupData} />
        </div>
      </div>
    </div>
  )
}
