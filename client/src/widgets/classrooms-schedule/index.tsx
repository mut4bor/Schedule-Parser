import * as style from './style.module.scss'
import { CSSProperties, Fragment } from 'react'
import { Link } from 'react-router-dom'
import { getWeekValue } from '../weeks-list/utils'
import { useGetClassroomsSchedulesQuery } from '@/shared/redux/slices/api/classroomsApi'

interface Props {
  classroomsIDs: string
}

export const ClassroomsSchedule = ({ classroomsIDs }: Props) => {
  const classroomsIDsArray = classroomsIDs.split(',').filter(Boolean)

  const { data: scheduleData } = useGetClassroomsSchedulesQuery(classroomsIDsArray, {
    skip: !classroomsIDsArray.length,
  })

  if (!scheduleData) return null

  return (
    <div className={style.scheduleTableWrapper}>
      <div
        className={style.scheduleTable}
        style={
          {
            '--groups-count': scheduleData.classrooms.length,
          } as CSSProperties
        }
      >
        <div className={`${style.scheduleCell} ${style.scheduleHeadCell}`}>Неделя</div>
        <div className={`${style.scheduleCell} ${style.scheduleHeadCell}`}>День недели</div>
        <div className={`${style.scheduleCell} ${style.scheduleHeadCell}`}>Время</div>

        {scheduleData.classrooms.map((classroom, index) => (
          <Link
            key={`${classroom.id}-${index}`}
            to={`/teachers/${classroom.id}`}
            target="_blank"
            className={`${style.scheduleCell} ${style.scheduleHeadCell} ${style.groupHeadCell}`}
          >
            {classroom.name} ({classroom.capacity})
          </Link>
        ))}

        {scheduleData.weeks.map((week, weekIndex) => (
          <Fragment key={`${week.weekName}-${weekIndex}`}>
            <div
              className={`${style.scheduleCell} ${style.weekCell}`}
              style={{
                gridRow: `span ${week.days.reduce((acc, day) => acc + day.timeSlots.length, 0)}`,
              }}
            >
              {getWeekValue(week.weekName)}
            </div>

            {week.days.map((day, dayIndex) => (
              <Fragment key={`${week.weekName}-${weekIndex}-${dayIndex}`}>
                <div
                  className={`${style.scheduleCell} ${style.dayCell}`}
                  style={{ gridRow: `span ${day.timeSlots.length}` }}
                >
                  {day.dayName}
                </div>

                {day.timeSlots.map((timeSlot, timeIndex) => (
                  <Fragment key={`${week.weekName}-${weekIndex}-${dayIndex}-${timeIndex}`}>
                    <div className={`${style.scheduleCell} ${style.timeCell}`}>{timeSlot.time}</div>

                    {timeSlot.lessons.map((teacherLessons, tIndex) => {
                      const cellId = `${week.weekName}-${weekIndex}-${dayIndex}-${timeIndex}-${tIndex}`

                      if (!teacherLessons || teacherLessons.length === 0) {
                        return (
                          <div className={`${style.scheduleCell} ${style.lessonCell}`} key={cellId}>
                            {/* Пусто */}
                          </div>
                        )
                      }

                      return (
                        <div className={`${style.scheduleCell} ${style.lessonCell}`} key={cellId}>
                          {teacherLessons.map((lesson, idx) => (
                            <p key={`${cellId}-lesson-${idx}`}>
                              {lesson.group.name}
                              {lesson.subject}
                              {lesson.lessonType && ` (${lesson.lessonType})`}
                              {lesson.teacher?.title && `, ${lesson.teacher.title}`}
                              {lesson.teacher?.lastName && ` ${lesson.teacher.lastName}`}
                              {lesson.teacher?.firstName &&
                                ` ${lesson.teacher.firstName.charAt(0).toUpperCase()}.`}
                              {lesson.teacher?.middleName &&
                                ` ${lesson.teacher.middleName.charAt(0).toUpperCase()}.`}
                            </p>
                          ))}
                        </div>
                      )
                    })}
                  </Fragment>
                ))}
              </Fragment>
            ))}
          </Fragment>
        ))}
      </div>
    </div>
  )
}
