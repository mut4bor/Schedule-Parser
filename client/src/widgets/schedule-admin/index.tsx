import * as style from './style.module.scss'
import {
  CreateLessonDTO,
  DeleteLessonDTO,
  UpdateLessonDTO,
} from '@/shared/redux/slices/api/scheduleApi'
import {
  useUpdateLessonMutation,
  useCreateLessonMutation,
  useDeleteLessonMutation,
  useGetGroupsSchedulesQuery,
} from '@/shared/redux/slices/api/scheduleApi'
import { CSSProperties, Fragment } from 'react'
import { LessonCell } from './LessonCell'
import { getWeekValue } from '../weeks-list/utils'
import { Link } from 'react-router-dom'

interface Props {
  groupsIDs: string
}

export const ScheduleAdmin = ({ groupsIDs }: Props) => {
  const groupsIdsArray = groupsIDs.split(',')

  const { data: scheduleData } = useGetGroupsSchedulesQuery(groupsIdsArray, {
    skip: !groupsIdsArray.length,
  })

  const [createLesson] = useCreateLessonMutation()
  const [updateLesson] = useUpdateLessonMutation()
  const [deleteLesson] = useDeleteLessonMutation()

  const handleCreateLesson = async (args: CreateLessonDTO) => {
    try {
      await createLesson(args).unwrap()
    } catch (err) {
      console.error('Ошибка при создании урока:', err)
    }
  }

  const handleUpdateLesson = async (args: UpdateLessonDTO) => {
    try {
      await updateLesson(args).unwrap()
    } catch (err) {
      console.error('Ошибка при обновлении урока:', err)
    }
  }

  const handleDeleteLesson = async (args: DeleteLessonDTO) => {
    try {
      await deleteLesson(args).unwrap()
    } catch (err) {
      console.error('Ошибка при удалении урока:', err)
    }
  }

  if (!scheduleData) return null

  const { groups, weeks } = scheduleData

  return (
    <div className={style.scheduleTableWrapper}>
      <div
        className={style.scheduleTable}
        style={{ '--groups-count': groups.length } as CSSProperties}
      >
        <div className={`${style.scheduleCell} ${style.scheduleHeadCell}`}>Неделя</div>
        <div className={`${style.scheduleCell} ${style.scheduleHeadCell}`}>День недели</div>
        <div className={`${style.scheduleCell} ${style.scheduleHeadCell}`}>Время</div>
        {groups.map((group) => (
          <Link
            key={group.id}
            to={`/groups/${group.id}`}
            target="_blank"
            className={`${style.scheduleCell} ${style.scheduleHeadCell} ${style.groupHeadCell}`}
          >
            {group.name}
          </Link>
        ))}

        {weeks.map((week) => {
          const weekRowCount = week.days.reduce((acc, day) => acc + day.timeSlots.length, 0)

          return (
            <Fragment key={week.weekName}>
              <div
                className={`${style.scheduleCell} ${style.weekCell}`}
                style={{ gridRow: `span ${weekRowCount}` }}
              >
                {getWeekValue(week.weekName)}
              </div>

              {week.days.map((day) => (
                <Fragment key={day.dayIndex}>
                  <div
                    className={`${style.scheduleCell} ${style.dayCell}`}
                    style={{ gridRow: `span ${day.timeSlots.length}` }}
                  >
                    {day.dayName}
                  </div>

                  {day.timeSlots.map((timeSlot, timeIndex) => (
                    <Fragment key={timeIndex}>
                      <div className={`${style.scheduleCell} ${style.timeCell}`}>
                        {timeSlot.time}
                      </div>

                      {timeSlot.lessons.map((lesson, lessonIndex) => {
                        const group = groups[lessonIndex]

                        if (!lesson) {
                          return <div className={style.scheduleCell} key={group.id}></div>
                        }

                        return (
                          <LessonCell
                            group={group}
                            weekName={week.weekName}
                            dayIndex={day.dayIndex}
                            lesson={lesson}
                            scheduleID=""
                            lessonIndex={lessonIndex}
                            onAdd={handleCreateLesson}
                            onUpdate={handleUpdateLesson}
                            onDelete={handleDeleteLesson}
                            key={group.id}
                          />
                        )
                      })}
                    </Fragment>
                  ))}
                </Fragment>
              ))}
            </Fragment>
          )
        })}
      </div>
    </div>
  )
}
