import * as style from './style.module.scss'
import { OptionsButtonProps } from './types'
import { forwardRef } from 'react'

export const OptionsButton = forwardRef<HTMLButtonElement, OptionsButtonProps>(
  ({ toggleIsOptionsListVisible, isOptionsListVisible }, ref) => {
    return (
      <button
        ref={ref}
        title="Опции"
        className={style.toggleOptionsButton}
        type="button"
        onClick={toggleIsOptionsListVisible}
      >
        <span className={`${style.optionsIcon} ${isOptionsListVisible ? style.cross : ''}`}></span>
        <span className={`${style.crossIcon} ${isOptionsListVisible ? style.active : ''}`}></span>
      </button>
    )
  },
)
