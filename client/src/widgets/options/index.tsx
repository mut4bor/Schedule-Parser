import * as style from './style.module.scss'
import { OptionsProps } from './types'
import { Radiobox } from '@/shared/ui'
import { useEffect, useState } from 'react'
import { OptionsButton } from '@/entities/options'

export const Options = ({ groupID }: OptionsProps) => {
  const [isOptionsListVisible, setIsOptionsListVisible] = useState(false)

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
    <div className={style.options}>
      <ul className={`${style.optionsList} ${isOptionsListVisible ? style.active : ''}`}>
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

      <OptionsButton
        handleToggleIsRadioboxVisible={() => setIsOptionsListVisible((prevState) => !prevState)}
        isRadioboxVisible={isOptionsListVisible}
      />
    </div>
  )
}
