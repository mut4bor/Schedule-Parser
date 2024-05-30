import { IName } from '@/shared/redux/slices/types'
import * as style from './style.module.scss'
import { Link } from 'react-router-dom'

type GroupLinkProps = {
  data: IName
}

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
