import * as style from './style.module.scss'

type EditDeleteActionsProps = {
  onEdit?: (() => void) | null
  onDuplicate?: (() => void) | null
  onDelete?: (() => void) | null
  editLabel?: string
  duplicateLabel?: string
  deleteLabel?: string
  className?: string
  editButtonClassName?: string
  duplicateButtonClassName?: string
  deleteButtonClassName?: string
  isLocked: boolean
}

export const EditDeleteActions = ({
  onEdit,
  onDelete,
  onDuplicate,
  editLabel = '✏️',
  duplicateLabel = '📄',
  deleteLabel = '🗑️',
  className,
  editButtonClassName,
  duplicateButtonClassName,
  deleteButtonClassName,
  isLocked,
}: EditDeleteActionsProps) => {
  return (
    <div className={`${style.container} ${className || ''}`}>
      {onEdit && (
        <button
          onClick={onEdit}
          className={`${style.editButton} ${isLocked ? `${style.isLocked}` : ''} ${editButtonClassName || ''}`}
          disabled={isLocked}
        >
          {editLabel}
        </button>
      )}
      {onDuplicate && (
        <button
          onClick={onDuplicate}
          className={`${style.duplicateButton} ${isLocked ? style.isLocked : ''} ${duplicateButtonClassName || ''}`}
          disabled={isLocked}
        >
          {duplicateLabel}
        </button>
      )}
      {onDelete && (
        <button
          onClick={onDelete}
          className={`${style.deleteButton} ${isLocked ? style.isLocked : ''} ${deleteButtonClassName || ''}`}
          disabled={isLocked}
        >
          {deleteLabel}
        </button>
      )}
    </div>
  )
}
