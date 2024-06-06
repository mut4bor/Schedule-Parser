import * as style from './style.module.scss'
import { useParams } from 'react-router-dom'
import { GroupSlider } from '@/entities/group/group-slider'
import { GroupDays } from '@/entities/group/group-days'
import { GroupSchedule } from '@/entities/group/group-schedule'
import {
  educationTypeChanged,
  facultyChanged,
  courseChanged,
  groupChanged,
  useAppDispatch,
  useGetGroupByIDQuery,
} from '@/shared/redux'
import { useEffect } from 'react'

export const GroupIDPage = () => {
  const dispatch = useAppDispatch()
  const { groupID } = useParams()

  useEffect(() => {
    if (!!groupID) {
      dispatch(groupChanged(groupID))
    }
  }, [groupID, dispatch])

  if (!groupID) {
    return <div className={style.error}>Invalid Group ID</div>
  }

  const { data: groupData, error: groupError, isLoading, isFetching } = useGetGroupByIDQuery(groupID)

  useEffect(() => {
    if (!!groupData) {
      const { educationType, faculty, course } = groupData
      dispatch(educationTypeChanged(educationType))
      dispatch(facultyChanged(faculty))
      dispatch(courseChanged(course))
    }
  }, [groupData, dispatch, groupID])

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
