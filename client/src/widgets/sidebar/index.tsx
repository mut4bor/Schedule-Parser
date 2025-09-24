import * as style from './style.module.scss'
import { forwardRef } from 'react'

interface Props {
  toggleIsSidebarVisible: () => void
  isSidebarVisible: boolean
  children: React.ReactNode
}

export const Sibebar = forwardRef<HTMLDivElement, Props>(
  ({ toggleIsSidebarVisible, isSidebarVisible, children }, ref) => {
    return (
      <div
        className={`${style.container} ${isSidebarVisible ? style.visible : ''}`}
        ref={ref}
      >
        <button
          onClick={toggleIsSidebarVisible}
          className={style.arrowButton}
          type="button"
          title={`${isSidebarVisible ? 'Скрыть' : 'Показать'} боковую панель`}
        >
          <svg
            className={`${style.arrowButtonSvg} ${isSidebarVisible ? style.rotated : null}`}
            viewBox="0 0 96 96"
          >
            <path
              className={style.arrowButtonSvgUse}
              d="M69.8437,43.3876,33.8422,13.3863a6.0035,6.0035,0,0,0-7.6878,9.223l30.47,25.39-30.47,25.39a6.0035,6.0035,0,0,0,7.6878,9.2231L69.8437,52.6106a6.0091,6.0091,0,0,0,0-9.223Z"
            />
          </svg>
        </button>

        {children}
      </div>
    )
  },
)
