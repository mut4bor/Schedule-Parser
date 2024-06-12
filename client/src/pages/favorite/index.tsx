import { useEffect } from 'react'
import * as style from './style.module.scss'
import { useNavigate } from 'react-router-dom'

export const FavoritePage = () => {
  const favoriteGroup = localStorage.getItem('favorite-group')
  const navigate = useNavigate()

  useEffect(() => {
    if (!!favoriteGroup) {
      navigate(`/${favoriteGroup}`)
    }
  }, [favoriteGroup])

  return (
    !favoriteGroup && (
      <div className={style.container}>
        <p className={style.emptyText}>Избранная группа не выбрана</p>
      </div>
    )
  )
}
