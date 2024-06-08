import * as style from './style.module.scss'
import { GroupSliderProps } from './types'
import { NavigationButton } from '@/entities/navigation-button'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { SkeletonTime } from '@/shared/vars/vars'
import { useAppDispatch, weekChanged, dayIndexChanged, useGetWeeksByIDQuery } from '@/shared/redux'
import { GroupWeeksSliderList } from './group-weeks-slider-list'

export const GroupWeeksSlider = ({ groupID }: GroupSliderProps) => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const [coursesSkeletonIsEnabled, setCoursesSkeletonIsEnabled] = useState(true)

  const { data: weeksData, error: weeksError } = useGetWeeksByIDQuery(groupID, {
    skip: !groupID,
  })

  useEffect(() => {
    const timer = setTimeout(() => {
      setCoursesSkeletonIsEnabled(false)
    }, SkeletonTime)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className={style.container}>
      <div>
        <NavigationButton
          text={'Назад'}
          onClick={() => {
            navigate('/courses')
            dispatch(weekChanged(''))
            dispatch(dayIndexChanged(-1))
          }}
        />
      </div>
      <ul className={style.list}>
        {!!weeksData && !coursesSkeletonIsEnabled ? (
          <GroupWeeksSliderList weeksData={weeksData} />
        ) : (
          Array.from({ length: 7 }).map((_, index) => (
            <li key={index}>
              <NavigationButton isSkeleton />
            </li>
          ))
        )}
      </ul>
    </div>
  )
}
