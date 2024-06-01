import * as style from './style.module.scss'
import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { GroupButton } from '@/entities/group'
import { useGetGroupByIDQuery, useAppDispatch, useAppSelector, navigationValueChanged } from '@/shared/redux'

export const GroupCenterButton = () => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { groupID } = useParams()
  const { data, error } = useGetGroupByIDQuery(groupID ?? '')

  const picked = useAppSelector((store) => store.navigation.navigationValue)

  if (!data) {
    return <div className=""></div>
  }

  const centerButtonTextHandler = () => {
    const makeTextSpan = (text: string, className?: string) => {
      return <span className={`${className} ${style.span}`}>{text}</span>
    }

    const group = makeTextSpan(data.group, style.group)
    const week = makeTextSpan(picked.week)
    const day = makeTextSpan(picked.day)
    const dash = makeTextSpan('—', style.dash)

    const result = [group]
    const isDayPicked = picked.day && data.dates[picked.week] && data.dates[picked.week][picked.day]
    const isWeekPicked = picked.week && data.dates[picked.week]

    if (isWeekPicked) {
      result.push(dash, week)
    }

    if (isDayPicked) {
      result.push(dash, day)
    }

    return result.map((span, index) => React.cloneElement(span, { key: index }))
  }

  const centerButtonClickHandler = () => {
    const isDayPicked = picked.day && data.dates[picked.week] && data.dates[picked.week][picked.day]
    const isWeekPicked = picked.week && data.dates[picked.week]
    if (isDayPicked) {
      dispatch(navigationValueChanged({ ...picked, day: '' }))
      return
    }

    if (isWeekPicked) {
      dispatch(navigationValueChanged({ ...picked, week: '' }))
      return
    }
    navigate('/')
  }

  return <GroupButton onClick={centerButtonClickHandler}> {centerButtonTextHandler()}</GroupButton>
}
