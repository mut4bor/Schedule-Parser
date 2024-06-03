import * as style from './style.module.scss'
import {
  useAppDispatch,
  useAppSelector,
  routerValueChanged,
  useGetEducationTypesQuery,
  useGetFacultiesQuery,
} from '@/shared/redux'
import { Link, useNavigate } from 'react-router-dom'
import { BASE_URL, COURSES_PATH, FACULTIES_PATH } from '@/shared/config'

export const MainPage = () => {
  const dispatch = useAppDispatch()
  const routerValue = useAppSelector((store) => store.router.routerValue)

  const { data: facultiesData, error: facultiesError } = useGetFacultiesQuery()
  if (!facultiesData) return <div className=""></div>

  const countMap = facultiesData.reduce((acc: { [key: string]: number }, item) => {
    acc[item.educationType] = (acc[item.educationType] || 0) + 1
    return acc
  }, {})

  const sortedData = Object.keys(countMap)
    .sort((a, b) => countMap[b] - countMap[a])
    .flatMap((educationType) => facultiesData.filter((item) => item.educationType === educationType))

  console.log(sortedData)

  const educationTypeArray = Object.values(sortedData).map((item) => {
    return item.educationType
  })
  const makeUniq = (array: string[]) => [...new Set(array)]
  const educationTypes = makeUniq(educationTypeArray)

  return (
    <div className={style.container}>
      {educationTypes.map((educationType) => (
        <div key={educationType}>
          {sortedData
            .filter((data) => data.educationType === educationType)
            .map((data, key) => (
              <Link
                to={COURSES_PATH}
                onClick={() => {
                  dispatch(
                    routerValueChanged({
                      ...routerValue,
                      educationType: data.educationType,
                      faculty: data.faculty,
                    }),
                  )
                }}
                className={style.link}
                key={key}
              >
                {data.faculty}
              </Link>
            ))}
        </div>
      ))}
    </div>
  )
}
