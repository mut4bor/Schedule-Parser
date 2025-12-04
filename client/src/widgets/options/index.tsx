import * as style from './style.module.scss'
import { OptionsList } from '@/widgets/options-list'
import { OptionsButton } from '@/entities/options'
import { forwardRef } from 'react'

interface Props {
  groupID: string
  isOptionsListVisible: boolean
  toggleOptionsList: () => void
}

export const Options = forwardRef<HTMLDivElement, Props>(
  ({ groupID, isOptionsListVisible, toggleOptionsList }, ref) => {
    return (
      <div className={style.options} ref={ref}>
        <OptionsList groupID={groupID} isOptionsListVisible={isOptionsListVisible} />
        <OptionsButton
          toggleIsOptionsListVisible={toggleOptionsList}
          isOptionsListVisible={isOptionsListVisible}
        />
      </div>
    )
  },
)
