import * as style from './style.module.scss'
import { Skeleton } from '@/shared/ui'
import { ILesson } from '@/shared/redux/types'
import {
  useUpdateLessonInDayMutation,
  useDeleteLessonFromDayMutation,
  useAppSelector,
} from '@/shared/redux'
import { AddItem } from '@/widgets/add-item'
import {
  useCreateLessonInDayMutation,
  useGetWeekScheduleByIDQuery,
} from '@/shared/redux/slices/apiSlice'
import { LessonListItem } from './LessonListItem'

interface Props {
  groupID: string
  pickedDayIndex: number
  pickedWeek: string | null
}

export const Schedule = ({ groupID, pickedDayIndex, pickedWeek }: Props) => {
  const accessToken = useAppSelector((store) => store.auth.accessToken)

  const { data: scheduleData } = useGetWeekScheduleByIDQuery(
    {
      groupID: groupID,
      week: pickedWeek ?? '',
    },
    {
      skip: !pickedWeek,
    },
  )

  const [createLesson] = useCreateLessonInDayMutation()
  const [updateLesson] = useUpdateLessonInDayMutation()
  const [deleteLesson] = useDeleteLessonFromDayMutation()

  const isScheduleData = !!scheduleData && pickedDayIndex !== -1 && !!scheduleData[pickedDayIndex]

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

  const handleUpdateLesson = async (lessonId: string, newLesson: Partial<ILesson>) => {
    if (!scheduleData || !pickedWeek || pickedDayIndex === -1) return
    try {
      const oldLesson = scheduleData[pickedDayIndex].find((lesson) => lesson._id === lessonId)

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
              <LessonListItem
                lesson={lesson}
                onUpdate={handleUpdateLesson}
                onDelete={handleDeleteLesson}
                key={index}
              />
            ))}

      {accessToken && isScheduleData && pickedWeek && (
        <AddItem type="time" onAdd={handleCreateLesson}>
          Добавить пару
        </AddItem>
      )}
    </ul>
  )
}
