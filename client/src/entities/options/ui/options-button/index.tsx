import * as style from './style.module.scss'
import { OptionsButtonProps } from './types'

export const OptionsButton = ({
  toggleIsOptionsListVisible,
  isOptionsListVisible,
}: OptionsButtonProps) => {
  return (
    <button
      title="Опции"
      className={style.toggleOptionsButton}
      type="button"
      onClick={toggleIsOptionsListVisible}
    >
      <span
        className={`${style.optionsIcon} ${isOptionsListVisible ? style.cross : null}`}
      ></span>
      <span
        className={`${style.crossIcon} ${isOptionsListVisible ? style.active : null}`}
      ></span>
    </button>
  )
}
