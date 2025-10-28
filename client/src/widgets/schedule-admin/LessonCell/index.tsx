import * as style from './style.module.scss'
import { ILesson } from '@/shared/redux/types'
import { LessonListItemAdmin } from './LessonListItem'
import { AddItem } from '@/widgets/add-item'

export const LessonCell = ({
  group,
  weekName,
  dayIndex,
  onUpdate,
  onDelete,
  onAdd,
}: {
  group: {
    groupName: string
    groupID: string
    lesson: ILesson
  }
  weekName: string
  dayIndex: number
  onUpdate: ({
    groupID,
    weekName,
    dayIndex,
    lessonId,
    newLesson,
  }: {
    groupID: string
    weekName: string
    dayIndex: number
    lessonId: string
    newLesson: Partial<ILesson>
  }) => Promise<void>
  onDelete: ({
    groupID,
    weekName,
    dayIndex,
    lessonId,
  }: {
    groupID: string
    weekName: string
    dayIndex: number
    lessonId: string
  }) => Promise<void>
  onAdd: ({
    groupID,
    weekName,
    dayIndex,
    time,
  }: {
    groupID: string
    weekName: string
    dayIndex: number
    time: string
  }) => Promise<void>
}) => {
  return (
    <div className={`${style.scheduleCell} ${style.lessonCell}`}>
      {group.lesson ? (
        <LessonListItemAdmin
          key={group.lesson._id}
          lesson={group.lesson}
          onUpdate={(lessonId, newLesson) =>
            onUpdate({ groupID: group.groupID, weekName, dayIndex, lessonId, newLesson })
          }
          onDelete={
            weekName !== 'even' && weekName !== 'odd'
              ? (lessonId) => onDelete({ groupID: group.groupID, weekName, dayIndex, lessonId })
              : undefined
          }
        />
      ) : (
        <AddItem
          type="time"
          onAdd={(newTime) => onAdd({ groupID: group.groupID, weekName, dayIndex, time: newTime })}
        >
          Добавить
        </AddItem>
      )}
    </div>
  )
}
