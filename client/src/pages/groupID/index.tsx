import * as style from './style.module.scss'
import { useParams } from 'react-router-dom'
import { GroupNavigation, GroupButtonList } from '@/entities/group'
import { useGetGroupByIDQuery } from '@/shared/redux'

export const GroupIDPage = () => {
  const { groupID } = useParams()

  if (!groupID) {
    return <div className={style.error}>Invalid Group ID</div>
  }

  const { data: groupData, error: groupError, isLoading, isFetching } = useGetGroupByIDQuery(groupID)

  if (isLoading || isFetching) {
    return <div className={style.loading}>Loading...</div>
  }

  if (groupError) {
    return <div className={style.error}>Error loading group data</div>
  }

  if (!groupData) {
    return <div className={style.error}>Group not found</div>
  }

  return (
    <div className={style.container}>
      <GroupNavigation data={groupData} />
      <GroupButtonList data={groupData} />
    </div>
  )
}
