import * as style from './style.module.scss'

export const Modal = ({
  children,
  onClose,
}: {
  children: React.ReactNode
  onClose: () => void
}) => {
  return (
    <div className={style.modalBackdrop} onClick={onClose}>
      <div className={style.modalContent} onClick={(e) => e.stopPropagation()}>
        <button className={style.modalCloseBtn} onClick={onClose}>
          ✖
        </button>
        {children}
      </div>
    </div>
  )
}
