import * as style from './style.module.scss'
import { Faculty } from '@/entities/faculty'
import { useGetFacultiesQuery } from '@/shared/redux'

export const MainPage = () => {
  const { data: facultiesData, error: facultiesError } = useGetFacultiesQuery()

  if (!facultiesData) return <div className=""></div>

  const sortedFacultiesData = Object.entries(facultiesData).sort(
    ([educationTypeA, facultiesA], [educationTypeB, facultiesB]) => facultiesB.length - facultiesA.length,
  )

  return (
    <div className={style.container}>
      {sortedFacultiesData.map(([educationType, faculties], key) => (
        <Faculty data={{ educationType, faculties }} key={key} />
      ))}
    </div>
  )
}
