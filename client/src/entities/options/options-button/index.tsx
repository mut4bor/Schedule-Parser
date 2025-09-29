import * as style from './style.module.scss'

interface Props {
  toggleIsOptionsListVisible: () => void
  isOptionsListVisible: boolean
}

export const OptionsButton = ({
  toggleIsOptionsListVisible,
  isOptionsListVisible,
}: Props) => {
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
