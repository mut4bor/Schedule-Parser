import * as style from './style.module.scss'
import { useGetGroupByIDQuery } from '@/shared/redux/slices/apiSlice'
import { useParams } from 'react-router-dom'
import { GroupArrow } from './group-navigation-arrow-button'
import { GroupCenterButton } from './group-navigation-center-button'
import { useGetNamesQuery } from '@/shared/redux/slices/apiSlice'

export const GroupNavigation = () => {
  const { groupId } = useParams()
  const { data: groupData, error: groupError } = useGetGroupByIDQuery(groupId ?? '')
  const { data: namesData, error: namesError } = useGetNamesQuery()

  if (!groupData || !namesData) {
    return <div className=""></div>
  }
  const sortedNamesData = [...namesData].sort((a, b) => a.index - b.index)

  const data = {
    groupData: groupData,
    namesData: sortedNamesData,
  }

  return (
    <div className={style.navigation}>
      <GroupArrow data={data} buttonType={'decrease'} />
      <GroupCenterButton />
      <GroupArrow data={data} buttonType={'increase'} />
    </div>
  )
}