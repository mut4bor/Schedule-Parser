import * as style from './style.module.scss'
import { Skeleton } from '@/shared/ui'
import { IWeek, ILesson } from '@/shared/redux/types'
import { EditableItem } from '@/widgets/editable-item'
import {
  useUpdateLessonInDayMutation,
  useDeleteLessonFromDayMutation,
} from '@/shared/redux'
import { AddItem } from '../add-item'
import { useCreateLessonInDayMutation } from '@/shared/redux/slices/apiSlice'

interface Props {
  scheduleData: IWeek | undefined
  groupID: string
  pickedDayIndex: number
  pickedWeek: string | null
}

export const Schedule = ({
  scheduleData,
  groupID,
  pickedDayIndex,
  pickedWeek,
}: Props) => {
  const [createLesson] = useCreateLessonInDayMutation()
  const [updateLesson] = useUpdateLessonInDayMutation()
  const [deleteLesson] = useDeleteLessonFromDayMutation()

  const isScheduleData =
    !!scheduleData && pickedDayIndex !== -1 && !!scheduleData[pickedDayIndex]

  const handleCreateLesson = async (time: string) => {
    if (!groupID || !pickedWeek || pickedDayIndex === -1) return
    try {
      await createLesson({
        id: groupID,
        weekName: pickedWeek,
        dayIndex: pickedDayIndex,
        time,
      }).unwrap()
    } catch (err) {
      console.error('Ошибка при создании урока:', err)
    }
  }

  const handleUpdateLesson = async (
    lessonId: string,
    newLesson: Partial<ILesson>,
  ) => {
    if (!scheduleData || !pickedWeek || pickedDayIndex === -1) return
    try {
      const oldLesson = scheduleData[pickedDayIndex].find(
        (lesson) => lesson._id === lessonId,
      )

      if (!oldLesson) return

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
        dayIndex: pickedDayIndex,
        lessonId,
        ...updatedLesson,
      }).unwrap()
    } catch (err) {
      console.error('Ошибка при обновлении урока:', err)
    }
  }

  const handleDeleteLesson = async (lessonId: string) => {
    if (!groupID || !pickedWeek || pickedDayIndex === -1) return
    try {
      await deleteLesson({
        id: groupID,
        weekName: pickedWeek,
        dayIndex: pickedDayIndex,
        lessonId,
      }).unwrap()
    } catch (err) {
      console.error('Ошибка при удалении урока:', err)
    }
  }

  return (
    <ul className={style.lessonList}>
      {isScheduleData && pickedWeek && (
        <AddItem type="time" onAdd={handleCreateLesson}>
          Добавить пару
        </AddItem>
      )}

      {!isScheduleData || !pickedWeek
        ? Array.from({ length: 5 }).map((_, index) => (
            <li key={index}>
              <Skeleton className={style.skeleton} />
            </li>
          ))
        : [...scheduleData[pickedDayIndex]]
            .sort((lessonA, lessonB) => {
              const [hA, mA] = lessonA.time.split(':').map(Number)
              const [hB, mB] = lessonB.time.split(':').map(Number)
              return hA - hB || mA - mB
            })
            .map((lesson, index) => (
              <li key={index} className={style.lessonListItem}>
                <EditableItem
                  value={lesson.time}
                  crudHandlers={{
                    onDelete: async () => handleDeleteLesson(lesson._id),
                  }}
                >
                  <p className={style.text}>
                    {lesson.time} - {lesson.subject}
                    {lesson.lessonType && ` (${lesson.lessonType})`}
                    {(lesson.teacher.title ||
                      lesson.teacher.lastName ||
                      lesson.teacher.firstName ||
                      lesson.teacher.middleName) && (
                      <>
                        {lesson.teacher.title && `, ${lesson.teacher.title}`}
                        {lesson.teacher.lastName &&
                          ` ${lesson.teacher.lastName}`}
                        {lesson.teacher.firstName &&
                          ` ${lesson.teacher.firstName.charAt(0).toUpperCase()}.`}
                        {lesson.teacher.middleName &&
                          ` ${lesson.teacher.middleName.charAt(0).toUpperCase()}.`}
                      </>
                    )}
                    {lesson.classroom && `, ${lesson.classroom}`}
                  </p>
                </EditableItem>

                <ul className={style.editList}>
                  {[
                    {
                      label: 'Время',
                      value: lesson.time,
                      type: 'time',
                      update: (newValue: string) =>
                        handleUpdateLesson(lesson._id, { time: newValue }),
                      delete: () =>
                        handleUpdateLesson(lesson._id, { time: '' }),
                    },
                    {
                      label: 'Предмет',
                      value: lesson.subject,
                      update: (newValue: string) =>
                        handleUpdateLesson(lesson._id, { subject: newValue }),
                      delete: () =>
                        handleUpdateLesson(lesson._id, { subject: '' }),
                    },
                    {
                      label: 'Тип',
                      value: lesson.lessonType,
                      update: (newValue: string) =>
                        handleUpdateLesson(lesson._id, {
                          lessonType: newValue,
                        }),
                      delete: () =>
                        handleUpdateLesson(lesson._id, { lessonType: '' }),
                    },
                    {
                      label: 'Титул преподавателя',
                      value: lesson.teacher.title ?? '',
                      update: (newValue: string) =>
                        handleUpdateLesson(lesson._id, {
                          teacher: { ...lesson.teacher, title: newValue },
                        }),
                      delete: () =>
                        handleUpdateLesson(lesson._id, {
                          teacher: { ...lesson.teacher, title: '' },
                        }),
                    },
                    {
                      label: 'Фамилия преподавателя',
                      value: lesson.teacher.lastName,
                      update: (newValue: string) =>
                        handleUpdateLesson(lesson._id, {
                          teacher: { ...lesson.teacher, lastName: newValue },
                        }),
                      delete: () =>
                        handleUpdateLesson(lesson._id, {
                          teacher: { ...lesson.teacher, lastName: '' },
                        }),
                    },
                    {
                      label: 'Имя преподавателя',
                      value: lesson.teacher.firstName,
                      update: (newValue: string) =>
                        handleUpdateLesson(lesson._id, {
                          teacher: { ...lesson.teacher, firstName: newValue },
                        }),
                      delete: () =>
                        handleUpdateLesson(lesson._id, {
                          teacher: { ...lesson.teacher, firstName: '' },
                        }),
                    },
                    {
                      label: 'Отчество преподавателя',
                      value: lesson.teacher.middleName,
                      update: (newValue: string) =>
                        handleUpdateLesson(lesson._id, {
                          teacher: { ...lesson.teacher, middleName: newValue },
                        }),
                      delete: () =>
                        handleUpdateLesson(lesson._id, {
                          teacher: { ...lesson.teacher, middleName: '' },
                        }),
                    },
                    {
                      label: 'Аудитория',
                      value: lesson.classroom,
                      update: (newValue: string) =>
                        handleUpdateLesson(lesson._id, { classroom: newValue }),
                      delete: () =>
                        handleUpdateLesson(lesson._id, { classroom: '' }),
                    },
                  ].map((field, index) => (
                    <li className={style.editListItem} key={index}>
                      <p className={style.editLabel}>{field.label}:</p>
                      <div className={style.editContainer}>
                        <EditableItem
                          value={field.value}
                          type={
                            (field?.type as
                              | 'text'
                              | 'date'
                              | 'week'
                              | 'time') ?? 'text'
                          }
                          crudHandlers={{
                            onUpdate: async (_, newValue) =>
                              field.update(newValue),
                            onDelete: async () => field.delete(),
                          }}
                        >
                          <p
                            className={`${style.editValue} ${!field.value ? style.empty : ''}`}
                          >
                            {field.value}
                          </p>
                        </EditableItem>
                      </div>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
    </ul>
  )
}
