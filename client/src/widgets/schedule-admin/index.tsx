import * as style from './style.module.scss'
import { CreateLessonDTO, DeleteLessonDTO, ILesson, UpdateLessonDTO } from '@/shared/redux/types'
import {
  useUpdateLessonInDayMutation,
  useCreateLessonInDayMutation,
  useDeleteLessonFromDayMutation,
  useGetGroupsSchedulesByIDQuery,
} from '@/shared/redux'
import { CSSProperties, Fragment, useMemo } from 'react'
import { LessonCell } from './LessonCell'
import { getWeekValue } from '../weeks-list/utils'
import { Link } from 'react-router-dom'

const dayNames = ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота']

interface Props {
  groupsIDs: string
}

export const ScheduleAdmin = ({ groupsIDs }: Props) => {
  const groupsIdsArray = groupsIDs.split(',')

  const { data: scheduleData } = useGetGroupsSchedulesByIDQuery(groupsIdsArray, {
    skip: !groupsIdsArray.length,
  })

  const uniqueGroups = useMemo(() => {
    if (!scheduleData) return []

    const groupsSet = new Map<string, string>()

    scheduleData.forEach((week) => {
      week.dates.forEach((day) => {
        day.forEach((timeSlot) => {
          timeSlot.lessons.forEach((lessonItem) => {
            groupsSet.set(lessonItem.groupID, lessonItem.groupName)
          })
        })
      })
    })

    return Array.from(groupsSet, ([id, name]) => ({ id, name }))
  }, [scheduleData])

  const [createLesson] = useCreateLessonInDayMutation()
  const [updateLesson] = useUpdateLessonInDayMutation()
  const [deleteLesson] = useDeleteLessonFromDayMutation()

  const handleCreateLesson = async (args: CreateLessonDTO) => {
    try {
      await createLesson({ ...args }).unwrap()
    } catch (err) {
      console.error('Ошибка при создании урока:', err)
    }
  }

  const handleUpdateLesson = async (args: UpdateLessonDTO) => {
    try {
      await updateLesson({ ...args }).unwrap()
    } catch (err) {
      console.error('Ошибка при обновлении урока:', err)
    }
  }

  const handleDeleteLesson = async (args: DeleteLessonDTO) => {
    try {
      await deleteLesson({ ...args }).unwrap()
    } catch (err) {
      console.error('Ошибка при удалении урока:', err)
    }
  }

  return (
    <div className={style.scheduleTableWrapper}>
      <div
        className={style.scheduleTable}
        style={{ '--groups-count': uniqueGroups.length } as CSSProperties}
      >
        {/* Заголовки */}
        <div className={`${style.scheduleCell} ${style.scheduleHeadCell}`}>Неделя</div>
        <div className={`${style.scheduleCell} ${style.scheduleHeadCell}`}>День недели</div>
        <div className={`${style.scheduleCell} ${style.scheduleHeadCell}`}>Время</div>
        {uniqueGroups.map((group) => (
          <Link
            key={group.id}
            to={`/groups/${group.id}`}
            target="_blank"
            className={`${style.scheduleCell} ${style.scheduleHeadCell} ${style.groupHeadCell}`}
          >
            {group.name}
          </Link>
        ))}

        {/* Тело */}
        {scheduleData?.map((week, weekIndex) => {
          // Считаем общее количество строк = сумма всех time slots
          const weekRowCount = week.dates.reduce((acc, day) => acc + day.length, 0)

          return (
            <Fragment key={weekIndex}>
              {/* 🌿 Неделя */}
              <div
                className={`${style.scheduleCell} ${style.weekCell}`}
                style={{ gridRow: `span ${weekRowCount}` }}
              >
                {getWeekValue(week.weekName)}
              </div>

              {week.dates.map((day, dayIndex) => {
                // Количество строк = количество time slots в дне
                const dayRowCount = day.length

                return (
                  <Fragment key={dayIndex}>
                    {/* 📅 День недели */}
                    <div
                      className={`${style.scheduleCell} ${style.dayCell}`}
                      style={{ gridRow: `span ${dayRowCount}` }}
                    >
                      {dayNames[dayIndex]}
                    </div>

                    {day.map((timeSlot, timeIndex) => (
                      <Fragment key={timeIndex}>
                        {/* ⏰ Время - одна строка */}
                        <div className={`${style.scheduleCell} ${style.timeCell}`}>
                          {timeSlot.time}
                        </div>

                        {/* 👥 Ячейки для каждой группы */}
                        {uniqueGroups.map((group) => {
                          const groupLesson = timeSlot.lessons.find(
                            (lesson) => lesson.groupID === group.id,
                          )

                          if (!groupLesson) {
                            return <div className={style.scheduleCell} key={group.id}></div>
                          }

                          return (
                            <LessonCell
                              key={group.id}
                              group={group}
                              weekName={week.weekName}
                              dayIndex={dayIndex}
                              lesson={groupLesson.lesson}
                              onAdd={handleCreateLesson}
                              onUpdate={handleUpdateLesson}
                              onDelete={handleDeleteLesson}
                            />
                          )
                        })}
                      </Fragment>
                    ))}
                  </Fragment>
                )
              })}
            </Fragment>
          )
        })}
      </div>
    </div>
  )
}
