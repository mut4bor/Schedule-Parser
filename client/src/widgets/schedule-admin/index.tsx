import * as style from './style.module.scss'
import { IGroup, ILesson } from '@/shared/redux/types'
import { useUpdateLessonInDayMutation } from '@/shared/redux'
import { AddItem } from '@/widgets/add-item'
import {
  useCreateLessonInDayMutation,
  useGetGroupsSchedulesByIDQuery,
} from '@/shared/redux/slices/apiSlice'
import { LessonListItemAdmin } from './LessonListItem'
import { CSSProperties, Fragment, useMemo } from 'react'

const dayNames = ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота']

interface Combination {
  dayIndex: number
  weekName: string
  time: string
}

const collectAllCombinations = (groupsData: IGroup[]): Combination[] => {
  const combinations: Combination[] = []

  groupsData.forEach((group) => {
    Object.entries(group.dates).forEach(([weekName, week]) => {
      week.forEach((dayLessons, dayIndex) => {
        dayLessons.forEach((lesson) => {
          const exists = combinations.some(
            (c) => c.dayIndex === dayIndex && c.weekName === weekName && c.time === lesson.time,
          )
          if (!exists) {
            combinations.push({ dayIndex, weekName, time: lesson.time })
          }
        })
      })
    })
  })

  const weekPriority = (weekName: string): number => {
    if (weekName === 'odd') return 0
    if (weekName === 'even') return 1
    return 2
  }

  const compareWeekNames = (a: string, b: string): number => {
    const pa = weekPriority(a)
    const pb = weekPriority(b)
    if (pa !== pb) return pa - pb

    if (pa === 2) {
      return a.localeCompare(b)
    }

    return 0
  }

  return combinations.sort((a, b) => {
    if (a.dayIndex !== b.dayIndex) return a.dayIndex - b.dayIndex
    if (a.time !== b.time) return a.time.localeCompare(b.time)
    return compareWeekNames(a.weekName, b.weekName)
  })
}

const LessonCell = ({
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

interface Props {
  groupsIDs: string
}

export const ScheduleAdmin = ({ groupsIDs }: Props) => {
  const groupsIdsArray = groupsIDs.split(',')

  const { data: groupsData } = useGetGroupsSchedulesByIDQuery(groupsIdsArray, {
    skip: !groupsIdsArray.length,
  })

  const [createLesson] = useCreateLessonInDayMutation()
  const [updateLesson] = useUpdateLessonInDayMutation()

  const allCombinations = useMemo(
    () => (groupsData ? collectAllCombinations(groupsData) : []),
    [groupsData],
  )

  const dayGroups = useMemo(() => {
    const groups: Record<number, Combination[]> = {}
    dayNames.forEach((_, idx) => {
      groups[idx] = allCombinations.filter((c) => c.dayIndex === idx)
    })
    return groups
  }, [allCombinations])

  const handleCreateLesson = async (
    groupID: string,
    weekName: string,
    dayIndex: number,
    time: string,
  ) => {
    if (!groupID) return
    try {
      await createLesson({ id: groupID, weekName, dayIndex, time }).unwrap()
    } catch (err) {
      console.error('Ошибка при создании урока:', err)
    }
  }

  const handleUpdateLesson = async (
    groupID: string,
    weekName: string,
    dayIndex: number,
    lessonId: string,
    newLesson: Partial<ILesson>,
  ) => {
    if (!groupsData) return
    try {
      const oldLesson = groupsData
        .find((g) => g._id === groupID)
        ?.dates[weekName][dayIndex].find((l) => l._id === lessonId)

      if (!oldLesson) return

      const updatedLesson: ILesson = {
        ...oldLesson,
        ...newLesson,
        teacher: { ...oldLesson.teacher, ...newLesson.teacher },
      }

      await updateLesson({
        id: groupID,
        weekName,
        dayIndex,
        lessonId,
        ...updatedLesson,
      }).unwrap()
    } catch (err) {
      console.error('Ошибка при обновлении урока:', err)
    }
  }

  const renderDayRows = () => {
    return dayNames.map((_, dayIndex) => {
      const dayCombos = dayGroups[dayIndex]

      const times = [...new Set(dayCombos.map((c) => c.time).sort((a, b) => a.localeCompare(b)))]

      const totalRows = times.reduce(
        (sum, t) => sum + dayCombos.filter((c) => c.time === t).length,
        0,
      )

      return (
        <Fragment key={dayIndex}>
          {times.map((time, timeIdx) => {
            const timeCombos = dayCombos.filter((c) => c.time === time)

            return (
              <Fragment key={`${dayIndex}-${time}`}>
                {timeCombos.map((combo, comboIdx, timeCombosArray) => (
                  <Fragment key={`${dayIndex}-${combo.time}-${combo.weekName}`}>
                    {/* День недели */}
                    {timeIdx === 0 && comboIdx === 0 && (
                      <div
                        className={`${style.scheduleCell} ${style.dayCell}`}
                        style={{ gridRow: `span ${totalRows}` }}
                      >
                        {dayNames[dayIndex]}
                      </div>
                    )}

                    {/* Время */}
                    {comboIdx === 0 && (
                      <div
                        className={`${style.scheduleCell} ${style.timeCell}`}
                        style={{ gridRow: `span ${timeCombosArray.length}` }}
                      >
                        {time}
                      </div>
                    )}

                    {/* Неделя */}
                    <div className={`${style.scheduleCell} ${style.weekCell}`}>
                      {combo.weekName}
                    </div>

                    {/* Уроки */}
                    {groupsData?.map((group) => (
                      <LessonCell
                        key={`${group._id}-${combo.weekName}-${dayIndex}-${combo.time}`}
                        group={group}
                        combo={combo}
                        dayIndex={dayIndex}
                        onUpdate={handleUpdateLesson}
                        onAdd={handleCreateLesson}
                      />
                    ))}
                  </Fragment>
                ))}
              </Fragment>
            )
          })}
        </Fragment>
      )
    })
  }

  return (
    <div className={style.scheduleTableWrapper}>
      <div
        className={style.scheduleTable}
        style={{ '--groups-count': groupsData?.length || 1 } as CSSProperties}
      >
        {/* Header */}
        <div className={`${style.scheduleCell} ${style.scheduleHeadCell}`}>День недели</div>
        <div className={`${style.scheduleCell} ${style.scheduleHeadCell}`}>Время</div>
        <div className={`${style.scheduleCell} ${style.scheduleHeadCell}`}>Неделя</div>
        {groupsData?.map((g) => (
          <div
            key={g._id}
            className={`${style.scheduleCell} ${style.scheduleHeadCell} ${style.groupHeadCell}`}
          >
            {g.group}
          </div>
        ))}

        {/* Body */}
        {groupsData && renderDayRows()}
      </div>
    </div>
  )
}
