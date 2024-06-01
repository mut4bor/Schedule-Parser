import * as style from './style.module.scss'
import { useParams } from 'react-router-dom'
import { GroupArrow } from './group-navigation-arrow-button'
import { GroupCenterButton } from './group-navigation-center-button'
import { useGetGroupByIDQuery, useGetNamesQuery } from '@/shared/redux'

export const GroupNavigation = () => {
  const { groupID } = useParams()
  const { data: groupData, error: groupError } = useGetGroupByIDQuery(groupID ?? '')
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
