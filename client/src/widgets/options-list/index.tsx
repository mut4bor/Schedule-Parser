import * as style from './style.module.scss'
import { OptionsProps } from './types'
import { useEffect, useState } from 'react'
import { Radiobox } from '@/shared/ui'

export const OptionsList = ({
  groupID,
  isOptionsListVisible,
}: OptionsProps) => {
  const [isRadioboxChecked, setIsRadioboxChecked] = useState(false)

  const favoriteGroup = localStorage.getItem('favorite-group')

  useEffect(() => {
    if (favoriteGroup === groupID) {
      setIsRadioboxChecked(true)
    }
  }, [groupID])

  useEffect(() => {
    if (isRadioboxChecked) {
      localStorage.setItem('favorite-group', groupID)
    }

    if (!isRadioboxChecked && favoriteGroup === groupID) {
      localStorage.removeItem('favorite-group')
    }
  }, [isRadioboxChecked, groupID])

  return (
    <ul
      className={`${style.optionsList} ${isOptionsListVisible ? style.active : null}`}
    >
      <li>
        <Radiobox
          title={'Избранная группа'}
          checked={isRadioboxChecked}
          onChange={() => setIsRadioboxChecked((prevState) => !prevState)}
        />
      </li>
    </ul>
  )
}
