import * as style from './style.module.scss'
import { OptionsButtonProps } from './types'

export const OptionsButton = ({ handleToggleIsRadioboxVisible, isRadioboxVisible }: OptionsButtonProps) => {
  return (
    <button title="Опции" className={style.toggleOptionsButton} type="button" onClick={handleToggleIsRadioboxVisible}>
      <span className={`${style.optionsIcon} ${isRadioboxVisible ? style.cross : ''}`}></span>
      <span className={`${style.crossIcon} ${isRadioboxVisible ? style.active : ''}`}></span>
    </button>
  )
}
