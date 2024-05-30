import * as style from './style.module.scss'
import { GroupLink } from '@/entities/group'
import { useGetNamesQuery } from '@/shared/redux'

export const MainPage = () => {
  const { data, error } = useGetNamesQuery()

  if (!data) return <div className=""></div>

  const sortedData = [...data].sort((a, b) => a.index - b.index)

  return (
    <div className={style.container}>
      <div className={style.main}>
        {sortedData.map((item, key) => {
          return <GroupLink key={key} data={item} />
        })}
      </div>
    </div>
  )
}
