import * as style from './style.module.scss'
import { useParams } from 'react-router-dom'
import { GroupButton } from '@/entities/group'
import { useGetGroupByIDQuery, useAppDispatch, useAppSelector, navigationValueChanged } from '@/shared/redux'

export const GroupButtonList = () => {
  const dispatch = useAppDispatch()
  const { groupId } = useParams()
  const { data, error } = useGetGroupByIDQuery(groupId ?? '')

  const picked = useAppSelector((store) => store.navigation.navigationValue)

  if (!data) {
    return <div className=""></div>
  }

  const isDayPicked = picked.day && data.dates[picked.week] && data.dates[picked.week][picked.day]
  const isWeekPicked = picked.week && data.dates[picked.week]

  const renderButtons = (items: string[], type: 'week' | 'day') => {
    return items.map((item, key) => (
      <GroupButton
        key={key}
        onClick={() => {
          dispatch(navigationValueChanged({ ...picked, [type]: item }))
        }}
      >
        {item}
      </GroupButton>
    ))
  }

  const renderTexts = (items: [string, string][]) => {
    return items.map(([time, subject], key) => (
      <p key={key} className={style.text}>
        {`${time} – ${subject}`}
      </p>
    ))
  }

  const handleRender = () => {
    if (isDayPicked) {
      return renderTexts(Object.entries(data.dates[picked.week][picked.day]))
    }
    if (isWeekPicked) {
      return renderButtons(Object.keys(data.dates[picked.week]), 'day')
    }
    if (data.dates) {
      return renderButtons(Object.keys(data.dates), 'week')
    }
    return null
  }

  return <div className={style.list}>{handleRender()}</div>
}
