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
import { CSSProperties, Fragment, useEffect, useMemo, useState } from 'react'
import { getWeekValue } from '@/widgets/weeks-list/utils'
import { Link } from 'react-router-dom'
import { LessonListItemAdmin } from './LessonListItem'
import { AdminAddButton } from '@/entities/admin'
import { Modal } from '@/widgets/modal'
import { ModalForm } from '@/widgets/modal-form'
import { ModalInput } from '@/widgets/modal-input'
import { ModalSelect } from '@/widgets/modal-select'
import {
  useGetAllTeachersQuery,
  useGetTeacherScheduleBySlotQuery,
} from '@/shared/redux/slices/api/teachersApi'
import { TimeSlots } from '@/shared/redux/types'
import { useGetAllClassroomsQuery } from '@/shared/redux/slices/api/classroomsApi'
import { useAppSelector } from '@/shared/redux/hooks'
import { useLocks } from '@/shared/hooks/useLocks'

interface Props {
  groupsIDs: string
}

export const ScheduleAdmin = ({ groupsIDs }: Props) => {
  const locked = useAppSelector((store) => store.locked)

  const groupsIdsArray = useMemo(() => groupsIDs.split(','), [groupsIDs])

  const { lock, unlock } = useLocks()

  useEffect(() => {
    groupsIdsArray.forEach((groupID) => lock('groups', groupID))

    const interval = setInterval(
      () => {
        groupsIdsArray.forEach((groupID) => lock('groups', groupID))
      },
      1000 * 60 * 3,
    ) // каждые 3 минуты

    return () => {
      clearInterval(interval)
      groupsIdsArray.forEach((groupID) => unlock('groups', groupID))
    }
  }, [groupsIdsArray])

  const { data: scheduleData } = useGetGroupsSchedulesQuery(groupsIdsArray, {
    skip: !groupsIdsArray.length,
  })

  const [createLesson] = useCreateLessonMutation()
  const [updateLesson] = useUpdateLessonMutation()
  const [deleteLesson] = useDeleteLessonMutation()

  const { data: teachersData } = useGetAllTeachersQuery()
  const { data: classroomsData } = useGetAllClassroomsQuery()

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
    classroomID: '',
    description: '',
  })

  const { currentData: teacherSlotData } = useGetTeacherScheduleBySlotQuery(
    {
      id: formState.teacherID,
      time: formState.time,
      dayOfWeek: Number(selectedContext?.dayIndex),
      weekName: selectedContext?.weekName ?? '',
    },
    {
      skip:
        !formState.teacherID ||
        !formState.time ||
        !selectedContext?.dayIndex ||
        !selectedContext?.weekName,
    },
  )

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

    const { time, classroomID, teacherID, lessonType, subject, description } = formState

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
        classroomID,
        teacherID,
        subject,
        lessonType,
        description,
      }).unwrap()

      setFormState({
        time: '',
        subject: '',
        teacherID: '',
        lessonType: '',
        classroomID: '',
        description: '',
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

  if (!scheduleData || !teachersData || !classroomsData) return null

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
                      const isLocked = !!locked.groups.find((item) => item[0] === group.id)

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
                            isLocked={isLocked}
                            key={cellId}
                          >
                            Добавить пару
                          </AdminAddButton>
                        )
                      }

                      return (
                        <div className={`${style.scheduleCell} ${style.lessonCell}`} key={cellId}>
                          <LessonListItemAdmin
                            groupID={group.id}
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
              isWarning={!!teacherSlotData}
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

            <ModalSelect
              label="Аудитория:"
              name="classroomID"
              value={formState.classroomID}
              onChange={(e) => handleChange('classroomID', e.target.value)}
              options={classroomsData.map((classroom) => ({
                value: classroom._id,
                label: `${classroom.name} (до ${classroom.capacity} человек)`,
              }))}
            />

            <ModalInput
              label="Описание (необязательно):"
              name="description"
              value={formState.description}
              onChange={(e) => handleChange('description', e.target.value)}
            />
          </ModalForm>
        </Modal>
      )}
    </div>
  )
}
