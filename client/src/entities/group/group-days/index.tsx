import * as style from './style.module.scss'
import { GroupDaysProps } from './types'
import { SVG } from '@/shared/ui'
import { useState, useEffect } from 'react'
import { useAppSelector, useGetWeekDaysByIDQuery } from '@/shared/redux'
import { Skeleton } from '@/shared/ui'
import { SkeletonTime } from '@/shared/vars/vars'
import { GroupDaysList } from './group-days-list'

export const GroupDays = ({ groupID, handleSetIsGroupDaysVisible, isGroupDaysVisible }: GroupDaysProps) => {
  const navigationValue = useAppSelector((store) => store.navigation.navigationValue)
  const { week: pickedWeek } = navigationValue

  const { data: daysData, error: daysError } = useGetWeekDaysByIDQuery(
    {
      groupID: groupID,
      week: pickedWeek,
    },
    {
      skip: !groupID || !pickedWeek,
    },
  )

  const [coursesSkeletonIsEnabled, setCoursesSkeletonIsEnabled] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setCoursesSkeletonIsEnabled(false)
    }, SkeletonTime)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className={`${style.container} ${isGroupDaysVisible ? style.visible : style.hidden}`}>
      <button
        onClick={() => {
          handleSetIsGroupDaysVisible(!isGroupDaysVisible)
        }}
        className={style.button}
        type="button"
        title="Скрыть/Показать дни недели"
      >
        <SVG
          href="#arrow"
          svgClassName={`${style.buttonSvg} ${isGroupDaysVisible ? style.rotated : ''}`}
          useClassName={style.buttonSvgUse}
        ></SVG>
      </button>
      <ul className={style.list}>
        {!!daysData && !coursesSkeletonIsEnabled ? (
          <GroupDaysList daysData={daysData} listElementClassName={style.listElement} />
        ) : (
          Array.from({ length: 6 }).map((_, index) => (
            <li className={style.listElement} key={index}>
              <Skeleton style={{ height: '3.6rem' }} />
            </li>
          ))
        )}
      </ul>
    </div>
  )
}
