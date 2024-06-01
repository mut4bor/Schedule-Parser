import * as style from './style.module.scss'
import { PaginationButtonProps } from './types'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { navigationValueChanged, useAppDispatch, useAppSelector } from '@/shared/redux'
import { SVG } from '@/shared/ui/SVG'

export const GroupArrow = (props: PaginationButtonProps) => {
  const {
    buttonType,
    data: { groupData, namesData },
  } = props
  const { educationType, faculty, course, groupID } = useParams()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const navigationValue = useAppSelector((store) => store.navigation.navigationValue)

  const [navigationLimits, setNavigationLimits] = useState({
    group: {
      min: '',
      max: '',
    },
    week: {
      min: '',
      max: '',
    },
    day: {
      min: '',
      max: '',
    },
  })

  useEffect(() => {
    if (!!namesData) {
      setNavigationLimits((previousState) => ({
        ...previousState,

        group: {
          min: namesData[0]._id,
          max: namesData.slice(-1)[0]._id,
        },
      }))
    }
    if (!!groupData.dates) {
      setNavigationLimits((previousState) => ({
        ...previousState,

        week: {
          min: Object.keys(groupData.dates)[0],
          max: Object.keys(groupData.dates).slice(-1)[0],
        },
      }))
    }
    if (!!groupData.dates[navigationValue.week]) {
      setNavigationLimits((previousState) => ({
        ...previousState,

        day: {
          min: Object.keys(groupData.dates[navigationValue.week])[0],
          max: Object.keys(groupData.dates[navigationValue.week]).slice(-1)[0],
        },
      }))
    }
  }, [groupData, namesData, navigationValue.week])

  const isArrowDisabled = () => {
    const day = navigationValue.day
    const week = navigationValue.week
    const group = navigationValue.group
    if (buttonType === 'increase') {
      if (!!group) {
        if (!!week) {
          if (!!day) {
            return day === navigationLimits.day.max
          }
          return week === navigationLimits.week.max
        }
        return group === navigationLimits.group.max
      }
    }
    if (buttonType === 'decrease') {
      if (!!group) {
        if (!!week) {
          if (!!day) {
            return day === navigationLimits.day.min
          }
          return week === navigationLimits.week.min
        }
        return group === navigationLimits.group.min
      }
    }
  }

  const arrowClickHandler = () => {
    const changeIndex = (currentIndex: number) => {
      return isArrowDisabled() ? currentIndex : buttonType === 'increase' ? currentIndex + 1 : currentIndex - 1
    }
    const isGroupPicked = !!groupData.dates && !!navigationValue.group
    const isWeekPicked = isGroupPicked && !!groupData.dates[navigationValue.week]
    const isDayPicked = isWeekPicked && !!groupData.dates[navigationValue.week][navigationValue.day]
    const weeks = Object.keys(groupData.dates)
    const days = !!navigationValue.week && Object.keys(groupData.dates[navigationValue.week])

    if (isDayPicked && days) {
      const currentIndex = days.indexOf(navigationValue.day)
      const newIndex = changeIndex(currentIndex)

      if (newIndex !== currentIndex) {
        dispatch(navigationValueChanged({ ...navigationValue, day: days[newIndex] }))
      }
      return
    }

    if (isWeekPicked && weeks) {
      const currentIndex = weeks.indexOf(navigationValue.week)
      const newIndex = changeIndex(currentIndex)

      if (newIndex !== currentIndex) {
        dispatch(navigationValueChanged({ ...navigationValue, week: weeks[newIndex] }))
      }
      return
    }
    if (isGroupPicked) {
      const idToNavigate = namesData.find((item) => {
        const currentIndex = groupData.index

        if (buttonType === 'increase') {
          if (isArrowDisabled()) {
            return item.index === currentIndex
          }
          return item.index === currentIndex + 1
        }

        if (buttonType === 'decrease') {
          if (isArrowDisabled()) {
            return item.index === currentIndex
          }
          return item.index === currentIndex - 1
        }

        return item.index === currentIndex
      })?._id

      navigate(`/${[educationType, faculty, course, idToNavigate].join('/')}`)
      return
    }
  }
  return (
    <button
      type="button"
      disabled={isArrowDisabled()}
      title={buttonType}
      className={style.button}
      onClick={arrowClickHandler}
    >
      <SVG
        href="#arrow"
        svgClassName={`${style.svg} ${buttonType === 'decrease' ? style.inverted : ''}`}
        useClassName={style.use}
      />
    </button>
  )
}
