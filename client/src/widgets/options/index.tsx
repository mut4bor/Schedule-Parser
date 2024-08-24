import * as style from './style.module.scss'
import { OptionsProps } from './types'
import { OptionsList } from '../options-list'
import { OptionsButton } from '@/entities/options'
import { forwardRef } from 'react'

export const Options = forwardRef<HTMLButtonElement, OptionsProps>(
  (
    {
      groupID,
      isOptionsListVisible,
      toggleOptionsList,
      ...props
    }: OptionsProps,
    ref,
  ) => {
    return (
      <div className={style.options}>
        <OptionsList
          groupID={groupID}
          isOptionsListVisible={isOptionsListVisible}
        />
        <OptionsButton
          toggleIsOptionsListVisible={toggleOptionsList}
          isOptionsListVisible={isOptionsListVisible}
          ref={ref}
          {...props}
        />
      </div>
    )
  },
)
