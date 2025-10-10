import * as style from './style.module.scss'
import { ILesson } from '@/shared/redux/types'
import { useUpdateLessonInDayMutation } from '@/shared/redux'
import {
  useCreateLessonInDayMutation,
  useGetGroupsSchedulesByIDQuery,
} from '@/shared/redux/slices/apiSlice'
import { CSSProperties, Fragment, useMemo } from 'react'
import { LessonCell } from './LessonCell'
import { Combination } from './types'
import { collectAllCombinations, dayNames } from './utils'

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

  return (
    <div className={style.scheduleTableWrapper}>
      <div
        className={style.scheduleTable}
        style={{ '--groups-count': groupsData?.length || 1 } as CSSProperties}
      >
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

        {dayNames.map((_, dayIndex) => {
          const dayCombos = dayGroups[dayIndex]

          const times = [
            ...new Set(dayCombos.map((c) => c.time).sort((a, b) => a.localeCompare(b))),
          ]

          const totalRows = times.reduce(
            (sum, t) => sum + dayCombos.filter((c) => c.time === t).length,
            0,
          )

          return (
            <Fragment key={dayIndex}>
              {times.map((time, timeIdx) => (
                <Fragment key={`${dayIndex}-${time}`}>
                  {dayCombos
                    .filter((c) => c.time === time)
                    .map((combo, comboIdx, timeCombosArray) => (
                      <Fragment key={`${dayIndex}-${combo.time}-${combo.weekName}`}>
                        {timeIdx === 0 && comboIdx === 0 && (
                          <div
                            className={`${style.scheduleCell} ${style.dayCell}`}
                            style={{ gridRow: `span ${totalRows}` }}
                          >
                            {dayNames[dayIndex]}
                          </div>
                        )}

                        {comboIdx === 0 && (
                          <div
                            className={`${style.scheduleCell} ${style.timeCell}`}
                            style={{ gridRow: `span ${timeCombosArray.length}` }}
                          >
                            {time}
                          </div>
                        )}

                        <div className={`${style.scheduleCell} ${style.weekCell}`}>
                          {combo.weekName}
                        </div>

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
              ))}
            </Fragment>
          )
        })}
      </div>
    </div>
  )
}
