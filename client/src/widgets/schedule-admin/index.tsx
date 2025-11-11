import * as style from './style.module.scss'
import {
  DeleteLessonDTO,
  isValidLessonType,
  LessonType,
  UpdateLessonDTO,
  useUpdateLessonMutation,
  useCreateLessonMutation,
  useDeleteLessonMutation,
  useGetGroupsSchedulesQuery,
} from '@/shared/redux/slices/api/scheduleApi'
import { CSSProperties, Fragment, useState } from 'react'
import { getWeekValue } from '../weeks-list/utils'
import { Link } from 'react-router-dom'
import { LessonListItemAdmin } from './LessonListItem'
import { AdminAddButton } from '@/entities/admin'
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
  const { data: teachersData } = useGetAllTeachersQuery()

  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleCancel = () => {
    setIsModalOpen(false)
    setSelectedContext(null)
  }

  const [selectedContext, setSelectedContext] = useState<{
    groupId: string
    weekName: string
    dayIndex: number
    time: string
  } | null>(null)

  const [formState, setFormState] = useState({
    time: '',
    subject: '',
    teacherID: '',
    lessonType: '',
    classroom: '',
  })

  const handleChange = (field: keyof typeof formState, value: string) => {
    setFormState((prev) => ({ ...prev, [field]: value }))
  }

  const handleCreateLesson = async (
    e: React.FormEvent<HTMLFormElement>,
    groupId: string,
    weekName: string,
    dayIndex: number,
  ) => {
    e.preventDefault()

    const { time, classroom, teacherID, lessonType, subject } = formState

    if (!isValidLessonType(lessonType)) {
      console.error('Недопустимый тип занятия:', lessonType)
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
        lessonType,
      }).unwrap()

      // Сброс формы
      setFormState({
        time: '',
        subject: '',
        teacherID: '',
        lessonType: '',
        classroom: '',
      })
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

  if (!scheduleData || !teachersData) return null

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

                      if (!lesson) {
                        return (
                          <AdminAddButton
                            onClick={() => {
                              setSelectedContext({
                                groupId: group.id,
                                weekName: week.weekName,
                                dayIndex: day.dayIndex,
                                time: timeSlot.time,
                              })
                              handleChange('time', timeSlot.time)
                              setIsModalOpen(true)
                            }}
                            key={cellId}
                          >
                            Добавить пару
                          </AdminAddButton>
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
                            onDelete={(args) => handleDeleteLesson(args)}
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

      {isModalOpen && selectedContext && (
        <Modal onClose={handleCancel}>
          <ModalForm
            onSubmit={(e) =>
              handleCreateLesson(
                e,
                selectedContext.groupId,
                selectedContext.weekName,
                selectedContext.dayIndex,
              )
            }
            onCancel={handleCancel}
          >
            <ModalSelect
              label="Время:"
              name="time"
              value={formState.time || selectedContext.time}
              onChange={(e) => handleChange('time', e.target.value)}
              options={TimeSlots.map((time) => ({
                value: time,
                label: time,
              }))}
            />

            <ModalInput
              label="Название предмета:"
              name="subject"
              value={formState.subject}
              onChange={(e) => handleChange('subject', e.target.value)}
            />

            <ModalSelect
              label="Преподаватель:"
              name="teacherID"
              value={formState.teacherID}
              onChange={(e) => handleChange('teacherID', e.target.value)}
              options={teachersData.map((teacher) => ({
                value: teacher._id,
                label: `${teacher.firstName} ${teacher.middleName} ${teacher.lastName}`,
              }))}
            />

            <ModalSelect
              label="Тип занятия:"
              name="lessonType"
              value={formState.lessonType}
              onChange={(e) => handleChange('lessonType', e.target.value)}
              options={Object.values(LessonType).map((value) => ({
                value,
                label: value,
              }))}
            />

            <ModalInput
              label="Аудитория:"
              name="classroom"
              value={formState.classroom}
              onChange={(e) => handleChange('classroom', e.target.value)}
            />
          </ModalForm>
        </Modal>
      )}
    </div>
  )
}
