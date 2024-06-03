import * as style from './style.module.scss'
import { GroupNavigationProps } from './types'
import { GroupArrow } from './group-navigation-arrow-button'
import { GroupCenterButton } from './group-navigation-center-button'
import { useGetNamesQuery, useAppSelector } from '@/shared/redux'

export const GroupNavigation = (props: GroupNavigationProps) => {
  const routerValue = useAppSelector((store) => store.router.routerValue)

  const { educationType, faculty, course } = routerValue

  const searchParams = new URLSearchParams({
    educationType: educationType,
    faculty: faculty,
    course: course,
  }).toString()

  const { data: groupData } = props
  const { data: namesData, error: namesError } = useGetNamesQuery(searchParams)

  if (!namesData) {
    return <div className=""></div>
  }

  const sortedNamesData = [...namesData].sort((a, b) => a.index - b.index)

  const combinedData = {
    groupData: groupData,
    namesData: sortedNamesData,
  }

  return (
    <div className={style.navigation}>
      <GroupArrow data={combinedData} buttonType={'decrease'} />
      <GroupCenterButton />
      <GroupArrow data={combinedData} buttonType={'increase'} />
    </div>
  )
}
