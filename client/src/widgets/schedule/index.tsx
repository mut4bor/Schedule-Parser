import * as style from './style.module.scss'
import { Skeleton } from '@/shared/ui'
import { useAppSelector } from '@/shared/redux'
import { IWeek, ILesson } from '@/shared/redux/types'
import { EditableItem } from '@/widgets/editable-item'
import {
  useUpdateLessonInDayMutation,
  useDeleteLessonFromDayMutation,
} from '@/shared/redux'

type Props = {
  scheduleData: IWeek | undefined
  groupID: string
}

export const Schedule = ({ scheduleData, groupID }: Props) => {
  const { dayIndex: pickedDayIndex, week: pickedWeek } = useAppSelector(
    (store) => store.navigation,
  )

  const [updateLesson] = useUpdateLessonInDayMutation()
  const [deleteLesson] = useDeleteLessonFromDayMutation()

  const isScheduleData =
    !!scheduleData &&
    pickedDayIndex !== -1 &&
    !!scheduleData[Object.keys(scheduleData)[pickedDayIndex]]

  const dayName = Object.keys(scheduleData ?? {})[pickedDayIndex]

  const handleUpdateLesson = async (
    time: string,
    newLesson: Partial<ILesson> & { newTime?: string },
  ) => {
    if (!scheduleData || !dayName || !pickedWeek) return
    try {
      const oldLesson = scheduleData[dayName][time]
      const updatedLesson: ILesson = {
        ...oldLesson,
        ...newLesson,
        teacher: {
          ...oldLesson.teacher,
          ...newLesson.teacher,
        },
      }

      await updateLesson({
        id: groupID,
        weekName: pickedWeek,
        day: dayName,
        time,
        newTime: newLesson.newTime,
        ...updatedLesson,
      }).unwrap()
    } catch (err) {
      console.error('Ошибка при обновлении урока:', err)
    }
  }

  const handleDeleteLesson = async (time: string) => {
    if (!dayName || !pickedWeek) return
    if (window.confirm(`Удалить урок в ${time}?`)) {
      try {
        await deleteLesson({
          id: groupID,
          weekName: pickedWeek,
          day: dayName,
          time,
        }).unwrap()
      } catch (err) {
        console.error('Ошибка при удалении урока:', err)
      }
    }
  }

  return (
    <ul className={style.list}>
      {!isScheduleData || !pickedWeek
        ? Array.from({ length: 5 }).map((_, index) => (
            <li key={index}>
              <Skeleton className={style.skeleton} />
            </li>
          ))
        : Object.entries(scheduleData[dayName])
            .sort(([timeA], [timeB]) => {
              const [hA, mA] = timeA.split(':').map(Number)
              const [hB, mB] = timeB.split(':').map(Number)
              return hA - hB || mA - mB
            })
            .map(([time, lesson], index) => (
              <li key={index} className={style.lessonBlock}>
                <p className={style.text}>
                  {time} - {lesson.subject}
                  {lesson.lessonType && ` (${lesson.lessonType})`}
                  {(lesson.teacher.title ||
                    lesson.teacher.lastName ||
                    lesson.teacher.firstName ||
                    lesson.teacher.middleName) && (
                    <>
                      {lesson.teacher.title && `, ${lesson.teacher.title}`}
                      {lesson.teacher.lastName && ` ${lesson.teacher.lastName}`}
                      {lesson.teacher.firstName &&
                        ` ${lesson.teacher.firstName.charAt(0).toUpperCase()}.`}
                      {lesson.teacher.middleName &&
                        ` ${lesson.teacher.middleName.charAt(0).toUpperCase()}.`}
                    </>
                  )}
                  {lesson.classroom && `, ${lesson.classroom}`}
                </p>

                <ul className={style.editList}>
                  <li>
                    <EditableItem
                      value={time}
                      crudHandlers={{
                        onUpdate: async (_, newValue) =>
                          handleUpdateLesson(time, { newTime: newValue }),
                        // onDelete: async () => handleDeleteLesson(time),
                      }}
                      className={style.lessonItem}
                    >
                      <p className={style.text}>Время: {time}</p>
                    </EditableItem>
                  </li>

                  <li>
                    <EditableItem
                      value={lesson.subject}
                      crudHandlers={{
                        onUpdate: async (_, newValue) =>
                          handleUpdateLesson(time, { subject: newValue }),
                      }}
                      className={style.lessonItem}
                    >
                      <p className={style.text}>Предмет: {lesson.subject}</p>
                    </EditableItem>
                  </li>

                  <li>
                    <EditableItem
                      value={lesson.lessonType}
                      crudHandlers={{
                        onUpdate: async (_, newValue) =>
                          handleUpdateLesson(time, { lessonType: newValue }),
                      }}
                      className={style.lessonItem}
                    >
                      <p className={style.text}>Тип: {lesson.lessonType}</p>
                    </EditableItem>
                  </li>

                  <li>
                    <EditableItem
                      value={lesson.teacher.title ?? ''}
                      crudHandlers={{
                        onUpdate: async (_, newValue) =>
                          handleUpdateLesson(time, {
                            teacher: { ...lesson.teacher, title: newValue },
                          }),
                      }}
                      className={style.lessonItem}
                    >
                      <p className={style.text}>
                        Титул преподавателя: {lesson.teacher.title ?? '-'}
                      </p>
                    </EditableItem>
                  </li>

                  <li>
                    <EditableItem
                      value={lesson.teacher.lastName}
                      crudHandlers={{
                        onUpdate: async (_, newValue) =>
                          handleUpdateLesson(time, {
                            teacher: { ...lesson.teacher, lastName: newValue },
                          }),
                      }}
                      className={style.lessonItem}
                    >
                      <p className={style.text}>
                        Фамилия преподавателя: {lesson.teacher.lastName}
                      </p>
                    </EditableItem>
                  </li>

                  <li>
                    <EditableItem
                      value={lesson.teacher.firstName}
                      crudHandlers={{
                        onUpdate: async (_, newValue) =>
                          handleUpdateLesson(time, {
                            teacher: { ...lesson.teacher, firstName: newValue },
                          }),
                      }}
                      className={style.lessonItem}
                    >
                      <p className={style.text}>
                        Имя преподавателя: {lesson.teacher.firstName}
                      </p>
                    </EditableItem>
                  </li>

                  <li>
                    <EditableItem
                      value={lesson.teacher.middleName}
                      crudHandlers={{
                        onUpdate: async (_, newValue) =>
                          handleUpdateLesson(time, {
                            teacher: {
                              ...lesson.teacher,
                              middleName: newValue,
                            },
                          }),
                      }}
                      className={style.lessonItem}
                    >
                      <p className={style.text}>
                        Отчество преподавателя: {lesson.teacher.middleName}
                      </p>
                    </EditableItem>
                  </li>

                  <li>
                    <EditableItem
                      value={lesson.classroom}
                      crudHandlers={{
                        onUpdate: async (_, newValue) =>
                          handleUpdateLesson(time, { classroom: newValue }),
                      }}
                      className={style.lessonItem}
                    >
                      <p className={style.text}>
                        Аудитория: {lesson.classroom}
                      </p>
                    </EditableItem>
                  </li>
                </ul>
              </li>
            ))}
    </ul>
  )
}
