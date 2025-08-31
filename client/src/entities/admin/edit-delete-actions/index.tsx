import * as style from './style.module.scss'

type EditDeleteActionsProps = {
  onEdit?: () => void
  onDelete?: () => void
  editLabel?: string
  deleteLabel?: string
  className?: string
  editButtonClassName?: string
  deleteButtonClassName?: string
}

export const EditDeleteActions = ({
  onEdit,
  onDelete,
  editLabel = '✏️',
  deleteLabel = '🗑️',
  className,
  editButtonClassName,
  deleteButtonClassName,
}: EditDeleteActionsProps) => {
  return (
    <div className={`${style.actions} ${className || ''}`}>
      {onEdit && (
        <button
          onClick={onEdit}
          className={`${style.editButton} ${editButtonClassName || ''}`}
        >
          {editLabel}
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
