import * as style from './style.module.scss'
import {
  DeleteLessonDTO,
  isValidLessonType,
  LessonType,
  UpdateLessonDTO,
} from '@/shared/redux/slices/api/scheduleApi'
import {
  useUpdateLessonMutation,
  useCreateLessonMutation,
  useDeleteLessonMutation,
  useGetGroupsSchedulesQuery,
} from '@/shared/redux/slices/api/scheduleApi'
import { CSSProperties, Fragment, useState } from 'react'
import { getWeekValue } from '../weeks-list/utils'
import { Link } from 'react-router-dom'
import { LessonListItemAdmin } from './LessonCell/LessonListItem'
import { AddItem } from '../add-item'
import { Modal } from '../modal'
import { ModalForm } from '../modal-form'
import { ModalInput } from '../modal-input'
import { ModalSelect } from '../modal-select'
import { useGetAllTeachersQuery } from '@/shared/redux/slices/api/teachersApi'
import { TimeSlots } from '@/shared/redux/types'

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

  const handleCreateLessonSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
    groupId: string,
    weekName: string,
    dayIndex: number,
  ) => {
    e.preventDefault()
    const formData = new FormData(e.target as HTMLFormElement)
    const time = formData.get('time') as string
    const classroom = formData.get('classroom') as string
    const teacherID = formData.get('teacherID') as string
    const lessonTypeRaw = formData.get('lessonType') as string
    const subject = formData.get('subject') as string

    if (!isValidLessonType(lessonTypeRaw)) {
      console.error('Недопустимый тип занятия:', lessonTypeRaw)
      return
    }

    try {
      await createLesson({
        id: groupId,
        weekName,
        dayIndex,
        time,
        classroom,
        teacherID,
        subject,
        lessonType: lessonTypeRaw,
      }).unwrap()
      setOpenModalId(null)
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

  const [openModalId, setOpenModalId] = useState<string | null>(null)
  const { data: teachersData } = useGetAllTeachersQuery()

  const handleCancel = () => {
    setOpenModalId(null)
  }

  if (!scheduleData) return null

  return (
    <div className={style.scheduleTableWrapper}>
      <div
        className={style.scheduleTable}
        style={{ '--groups-count': scheduleData.groups.length } as CSSProperties}
      >
        <div className={`${style.scheduleCell} ${style.scheduleHeadCell}`}>Неделя</div>
        <div className={`${style.scheduleCell} ${style.scheduleHeadCell}`}>День недели</div>
        <div className={`${style.scheduleCell} ${style.scheduleHeadCell}`}>Время</div>
        {scheduleData.groups.map((group, index) => (
          <Link
            key={`${group.id}-${index}`}
            to={`/groups/${group.id}`}
            target="_blank"
            className={`${style.scheduleCell} ${style.scheduleHeadCell} ${style.groupHeadCell}`}
          >
            {group.name}
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

                    {timeSlot.lessons.map((lesson, lessonIndex) => {
                      const group = scheduleData.groups[lessonIndex]
                      const cellId = `${week.weekName}-${weekIndex}-${dayIndex}-${timeIndex}-${lessonIndex}`

                      if (!teachersData) {
                        return null
                      }

                      if (!lesson) {
                        return (
                          <AddItem
                            addButtonLabel="Добавить пару"
                            isAdding={openModalId === cellId}
                            setIsAdding={(isAdding) => setOpenModalId(isAdding ? cellId : null)}
                            key={cellId}
                          >
                            <Modal onClose={handleCancel}>
                              <ModalForm
                                onSubmit={(e) =>
                                  handleCreateLessonSubmit(e, group.id, week.weekName, day.dayIndex)
                                }
                                onCancel={handleCancel}
                              >
                                <ModalSelect
                                  label="Время:"
                                  name="time"
                                  defaultValue={timeSlot.time}
                                  options={TimeSlots.map((time) => ({
                                    value: time,
                                    label: time,
                                  }))}
                                />
                                <ModalInput
                                  label="Название предмета:"
                                  name="subject"
                                  defaultValue=""
                                />
                                <ModalSelect
                                  label="Преподаватель:"
                                  name="teacherID"
                                  defaultValue=""
                                  options={teachersData.map((teacher) => ({
                                    value: teacher._id,
                                    label: `${teacher.firstName} ${teacher.middleName} ${teacher.lastName}`,
                                  }))}
                                />
                                <ModalSelect
                                  label="Тип занятия:"
                                  name="lessonType"
                                  defaultValue=""
                                  options={Object.values(LessonType).map((value) => ({
                                    value: value,
                                    label: value,
                                  }))}
                                />
                                <ModalInput label="Аудитория:" name="classroom" defaultValue="" />
                              </ModalForm>
                            </Modal>
                          </AddItem>
                        )
                      }

                      return (
                        <div className={`${style.scheduleCell} ${style.lessonCell}`} key={cellId}>
                          <LessonListItemAdmin
                            lesson={lesson}
                            scheduleID={''}
                            dayIndex={day.dayIndex}
                            lessonIndex={lessonIndex}
                            onUpdate={handleUpdateLesson}
                            onDelete={
                              week.weekName !== 'even' && week.weekName !== 'odd'
                                ? (args) => handleDeleteLesson(args)
                                : undefined
                            }
                          />
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
