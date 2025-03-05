import * as style from './style.module.scss'
import { OptionsProps } from './types'
import { OptionsList } from '@/widgets/options-list'
import { OptionsButton } from '@/entities/options'
import { forwardRef } from 'react'

export const Options = forwardRef<HTMLDivElement, OptionsProps>(
  ({ groupID, isOptionsListVisible, toggleOptionsList }: OptionsProps, ref) => {
    return (
      <div className={style.options} ref={ref}>
        <OptionsList
          groupID={groupID}
          isOptionsListVisible={isOptionsListVisible}
        />
        <OptionsButton
          toggleIsOptionsListVisible={toggleOptionsList}
          isOptionsListVisible={isOptionsListVisible}
        />
      </div>
    )
  },
)
