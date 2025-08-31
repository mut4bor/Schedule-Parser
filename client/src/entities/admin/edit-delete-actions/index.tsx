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
}: EditDeleteActionsProps) => {
  return (
    <div className={`${style.container} ${className || ''}`}>
      {onEdit && (
        <button
          onClick={onEdit}
          className={`${style.editButton} ${editButtonClassName || ''}`}
        >
          {editLabel}
        </button>
      )}
      {onDuplicate && (
        <button
          onClick={onDuplicate}
          className={`${style.duplicateButton} ${duplicateButtonClassName || ''}`}
        >
          {duplicateLabel}
        </button>
      )}
      {onDelete && (
        <button
          onClick={onDelete}
          className={`${style.deleteButton} ${deleteButtonClassName || ''}`}
        >
          {deleteLabel}
        </button>
      )}
    </div>
  )
}
