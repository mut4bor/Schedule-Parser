import * as style from './style.module.scss'
import { BackToPreviousLink } from '@/entities/navigation'
import { WeeksButton } from '@/entities/weeks'
import { useEffect } from 'react'
import {
  useAppDispatch,
  useAppSelector,
  useGetWeeksByIDQuery,
  weekChanged,
} from '@/shared/redux'
import { getDaysInRange, getDayToPick } from '@/shared/hooks'
import { Skeleton } from '@/shared/ui'
import routes from '@/shared/routes'
import { ErrorComponent } from '@/widgets/error'
import { useParams } from 'react-router-dom'

const { day } = getDayToPick()

export const WeeksList = () => {
  const { groupID } = useParams()

  const { data: weeksData, error: weeksError } = useGetWeeksByIDQuery(
    groupID ?? '',
    {
      skip: !groupID,
    },
  )

  const dispatch = useAppDispatch()

  const pickedWeek = useAppSelector((store) => store.navigation.week)

  useEffect(() => {
    if (!!weeksData) {
      const daysRange = weeksData.map((item) => getDaysInRange(item))

      const currentWeekIndex = daysRange.findIndex((subArray) =>
        subArray.includes(day),
      )
      const currentWeek = weeksData[currentWeekIndex]

      if (currentWeek) {
        dispatch(weekChanged(currentWeek))
        return
      }

      dispatch(weekChanged(weeksData[0]))
    }

    return () => {
      dispatch(weekChanged(null))
    }
  }, [dispatch, weeksData])

  if (weeksError) {
    return <ErrorComponent error={weeksError} />
  }

  return (
    <div className={style.container}>
      <BackToPreviousLink href={routes.COURSES_PATH} />

      <ul className={style.list}>
        {!weeksData
          ? Array.from({ length: 7 }).map((_, index) => (
              <li key={index}>
                <Skeleton className={style.skeleton} />
              </li>
            ))
          : weeksData.map((week, index) => (
              <li key={index}>
                <WeeksButton
                  text={week}
                  onClick={() => {
                    dispatch(weekChanged(week))
                  }}
                  isActive={pickedWeek === week}
                />
              </li>
            ))}
      </ul>
    </div>
  )
}
