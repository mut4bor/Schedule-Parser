import * as style from './style.module.scss'
import { OptionsProps } from './types'
import { useEffect, useState, forwardRef } from 'react'
import { Radiobox } from '@/shared/ui'
import { createTapStopPropagationHandler } from '@/shared/hooks'

export const OptionsList = forwardRef<HTMLUListElement, OptionsProps>(({ groupID, isOptionsListVisible }, ref) => {
  const [isRadioboxChecked, setIsRadioboxChecked] = useState(false)

  useEffect(() => {
    if (groupID === localStorage.getItem('favorite-group')) {
      setIsRadioboxChecked(true)
    }
  }, [groupID])

  const onRadioboxChange = () => {
    setIsRadioboxChecked((prevState) => !prevState)
    isRadioboxChecked ? localStorage.removeItem('favorite-group') : localStorage.setItem('favorite-group', groupID)
  }

  return (
    <ul
      className={`${style.optionsList} ${isOptionsListVisible ? style.active : ''}`}
      {...createTapStopPropagationHandler()}
    >
      <li>
        <Radiobox
          id={'optionsRadiobox'}
          name={'optionsRadiobox'}
          onChange={onRadioboxChange}
          title={'Избранная группа'}
          checked={isRadioboxChecked}
        />
      </li>
    </ul>
  )
})
