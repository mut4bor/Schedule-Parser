import * as style from './style.module.scss'
import { OptionsProps } from './types'
import { useEffect, useState, forwardRef } from 'react'
import { Radiobox } from '@/shared/ui'

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
    <ul ref={ref} className={`${style.optionsList} ${isOptionsListVisible ? style.active : ''}`}>
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
