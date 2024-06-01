import * as style from './style.module.scss'
import { GroupLink } from '@/entities/group'
import { useGetNamesQuery } from '@/shared/redux'
import { useParams } from 'react-router-dom'

export const GroupsPage = () => {
  const { educationType, faculty, course } = useParams()

  if (!educationType || !faculty || !course) {
    return <div className=""></div>
  }
  const searchParams = new URLSearchParams({
    educationType: educationType,
    faculty: faculty,
    course: course,
  }).toString()

  const { data, error } = useGetNamesQuery(searchParams)

  if (!data) return <div className=""></div>

  const sortedData = [...data].sort((a, b) => a.index - b.index)

  return (
    <div className={style.container}>
      <div className={style.main}>
        {sortedData.map((item, key) => {
          return <GroupLink path={`/${educationType}/${faculty}/${course}/${item._id}`} key={key} data={item} />
        })}
      </div>
    </div>
  )
}
