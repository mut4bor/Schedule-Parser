import * as style from './style.module.scss'
import { GroupLinkProps } from './types'
import { Link } from 'react-router-dom'

export const GroupLink = (props: GroupLinkProps) => {
  const {
    data: { group, _id, index },
  } = props

  return (
    <>
      <Link className={style.button} to={`/${_id}`}>
        {group}
      </Link>
    </>
  )
}
