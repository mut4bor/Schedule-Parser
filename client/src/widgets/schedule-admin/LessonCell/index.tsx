import * as style from './style.module.scss'
import { ILesson } from '@/shared/redux/types'
import { Combination } from '../types'
import { LessonListItemAdmin } from './LessonListItem'
import { AddItem } from '@/widgets/add-item'

export const LessonCell = ({
  group,
  combo,
  dayIndex,
  onUpdate,
  onAdd,
}: {
  group: any
  combo: Combination
  dayIndex: number
  onUpdate: (
    groupId: string,
    weekName: string,
    dayIndex: number,
    lessonId: string,
    newLesson: Partial<ILesson>,
  ) => Promise<void>
  onAdd: (groupId: string, weekName: string, dayIndex: number, time: string) => Promise<void>
}) => {
  const lesson = group.dates?.[combo.weekName]?.[dayIndex]?.find(
    (l: ILesson) => l.time === combo.time,
  )

  return (
    <div className={`${style.scheduleCell} ${style.lessonCell}`}>
      {lesson ? (
        <LessonListItemAdmin
          key={lesson._id}
          lesson={lesson}
          onUpdate={(lessonId, newLesson) =>
            onUpdate(group._id, combo.weekName, dayIndex, lessonId, newLesson)
          }
        />
      ) : (
        <AddItem
          type="time"
          onAdd={(newTime) => onAdd(group._id, combo.weekName, dayIndex, newTime)}
        >
          Добавить
        </AddItem>
      )}
    </div>
  )
}
