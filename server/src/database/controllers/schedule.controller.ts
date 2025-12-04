import { Group } from '@/database/models/group.model.js'
import { Schedule } from '@/database/models/schedule.model.js'
import { Teacher } from '@/database/models/teacher.model.js'
import '@/database/models/classroom.model.js'
import { dayNames, ISchedule, LessonType, TimeSlots } from '@/types/index.js'
import { Request, Response } from 'express'

const getScheduleById = async (req: Request, res: Response) => {
  try {
    const { scheduleID } = req.params

    if (!scheduleID) {
      return res.status(400).json({
        message: 'ID обязателен',
      })
    }

    const schedule = await Schedule.findById(scheduleID)
      .populate('days.lessons.teacher')
      .populate('days.lessons.classroom')

    if (!schedule) {
      return res.status(404).json({ message: 'Расписание не найдено' })
    }

    res.status(200).json(schedule)
  } catch (error) {
    res.status(500).json({
      message: error instanceof Error ? error.message : 'Неизвестная ошибка',
    })
  }
}

const getWeeksByGroupId = async (req: Request, res: Response) => {
  try {
    const { id } = req.params

    if (!id) {
      return res.status(400).json({ message: 'ID обязателен' })
    }

    const group = await Group.findById(id)
    if (!group) {
      return res.status(404).json({ message: 'Группа не найдена' })
    }

    const schedules = await Schedule.find({ group: id }).select('weekName isActive').lean()

    const weeks = schedules.map((s) => ({
      weekName: s.weekName,
      isActive: s.isActive,
      _id: s._id,
    }))

    res.status(200).json(weeks)
  } catch (error) {
    res.status(500).json({
      message: error instanceof Error ? error.message : 'Неизвестная ошибка',
    })
  }
}

const getGroupsSchedules = async (req: Request, res: Response) => {
  try {
    const { ids } = req.params

    if (!ids) {
      return res.status(400).json({ message: 'ID обязателен' })
    }

    const idArray = ids.split(',')
    const groups = await Group.find({ _id: { $in: idArray } })
      .populate('educationType', 'name')
      .populate('faculty', 'name')
      .populate('course', 'name')
      .lean()

    if (!groups || groups.length === 0) {
      return res.status(404).json({ message: 'Группы не найдены' })
    }

    const groupsList = groups.map((g) => ({
      id: String(g._id),
      name: g.name || '',
    }))

    const schedules = await Schedule.find({
      group: { $in: idArray },
    })
      .populate('days.lessons.teacher')
      .populate('days.lessons.classroom')
      .lean()

    // Группируем расписания по неделям
    const weekMap = new Map()

    schedules.forEach((schedule) => {
      const weekKey = schedule.weekName
      if (!weekMap.has(weekKey)) {
        weekMap.set(weekKey, {
          weekName: schedule.weekName,
          isActive: schedule.isActive,
          schedulesByGroup: new Map(),
        })
      }
      weekMap.get(weekKey).schedulesByGroup.set(String(schedule.group), schedule)
    })

    // Формируем унифицированную структуру
    const weeks = Array.from(weekMap.values()).map((week) => {
      const days = dayNames.map((dayName, dayIndex) => {
        const timeSlots = TimeSlots.map((time) => {
          const lessons = groupsList.map((group) => {
            const schedule: ISchedule = week.schedulesByGroup.get(group.id)
            if (!schedule) return null

            const day = schedule.days.find((d) => d.dayOfWeek === dayIndex)
            if (!day) return null

            const lesson = day.lessons.find((l) => l.time === time)
            return lesson || null
          })

          return {
            time,
            lessons,
          }
        })

        return {
          dayName,
          dayIndex,
          timeSlots,
        }
      })

      return {
        weekName: week.weekName,
        isActive: week.isActive,
        days,
      }
    })

    res.status(200).json({ groups: groupsList, weeks })
  } catch (error) {
    res.status(500).json({
      message: error instanceof Error ? error.message : 'Неизвестная ошибка',
    })
  }
}

const createWeekSchedule = async (req: Request, res: Response) => {
  try {
    const { weekName, groupID, days, isActive } = req.body

    const existingSchedule = await Schedule.findOne({ weekName, group: groupID })
    if (existingSchedule) {
      return res.status(400).json({
        error: 'Расписание для этой недели и группы уже существует',
      })
    }

    const schedule = new Schedule({
      weekName,
      group: groupID,
      days,
      isActive: isActive,
    })

    await schedule.save()

    res.status(201).json({
      message: 'Расписание успешно создано',
    })
  } catch (error) {
    res.status(500).json({
      message: error instanceof Error ? error.message : 'Неизвестная ошибка',
    })
  }
}

const updateWeekSchedule = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const { weekName, days, isActive } = req.body

    const updateData: Partial<{
      weekName: string
      days: any
      isActive: boolean
    }> = {}

    if (typeof weekName !== 'undefined') updateData.weekName = weekName
    if (typeof days !== 'undefined') updateData.days = days
    if (typeof isActive !== 'undefined') updateData.isActive = isActive

    const schedule = await Schedule.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    })

    if (!schedule) {
      return res.status(404).json({
        error: 'Расписание не найдено',
      })
    }

    res.json({
      message: 'Расписание успешно обновлено',
    })
  } catch (error) {
    res.status(500).json({
      message: error instanceof Error ? error.message : 'Неизвестная ошибка',
    })
  }
}

const deleteWeekSchedule = async (req: Request, res: Response) => {
  try {
    const { id } = req.params

    const schedule = await Schedule.findByIdAndDelete(id)

    if (!schedule) {
      return res.status(404).json({
        error: 'Расписание не найдено',
      })
    }

    res.json({
      message: 'Расписание успешно удалено',
    })
  } catch (error) {
    res.status(500).json({
      message: error instanceof Error ? error.message : 'Неизвестная ошибка',
    })
  }
}

const createLesson = async (req: Request, res: Response) => {
  try {
    const {
      id: groupID,
      weekName,
      dayIndex: dayOfWeek,
      time,
      classroomID,
      teacherID,
      subject,
      lessonType,
      description,
    } = req.body

    if (
      !groupID ||
      !weekName ||
      dayOfWeek === undefined ||
      !time ||
      !classroomID ||
      !teacherID ||
      !subject ||
      !lessonType
    ) {
      return res.status(400).json({
        message: 'All fields are required',
      })
    }

    if (dayOfWeek < 0 || dayOfWeek > 5) {
      return res.status(400).json({
        message: 'Day of week must be between 0 (Monday) and 5 (Saturday)',
      })
    }

    if (!Object.values(LessonType).includes(lessonType)) {
      return res.status(400).json({
        message: 'Invalid lesson type. Must be one of: ' + Object.values(LessonType).join(', '),
      })
    }

    const group = await Group.findById(groupID)
    if (!group) {
      return res.status(404).json({ message: 'Group not found' })
    }

    const teacher = await Teacher.findById(teacherID)
    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found' })
    }

    let schedule = await Schedule.findOne({ weekName, group: groupID })

    if (!schedule) {
      schedule = new Schedule({
        weekName,
        group: groupID,
        days: [],
      })
    }

    let dayIndex = schedule.days.findIndex((day) => day.dayOfWeek === dayOfWeek)
    if (dayIndex === -1) {
      schedule.days.push({
        dayOfWeek,
        lessons: [],
      })
      dayIndex = schedule.days.length - 1
    }

    const timeConflict = schedule.days[dayIndex].lessons.some((lesson) => lesson.time === time)

    if (timeConflict) {
      return res.status(400).json({
        message: `A lesson already exists at ${time} on this day`,
      })
    }

    const newLesson: any = {
      time,
      classroom: classroomID,
      subject,
      teacher: teacherID,
      lessonType,
    }

    if (typeof description === 'string' && description.trim() !== '') {
      newLesson.description = description
    }

    schedule.days[dayIndex].lessons.push(newLesson)

    schedule.days[dayIndex].lessons.sort((a, b) => {
      return a.time.localeCompare(b.time)
    })

    await schedule.save()

    res.status(201).json({
      message: 'Lesson added successfully',
    })
  } catch (error) {
    res.status(500).json({
      message: error instanceof Error ? error.message : 'Неизвестная ошибка',
    })
  }
}

const updateLesson = async (req: Request, res: Response) => {
  try {
    const { scheduleID, dayIndex, lessonIndex } = req.params
    const { time, classroomID, teacherID, subject, lessonType, description } = req.body

    const parsedDayIndex = parseInt(dayIndex)
    const parsedLessonIndex = parseInt(lessonIndex)

    const schedule = await Schedule.findById(scheduleID)
    if (!schedule) {
      return res.status(404).json({ message: 'Schedule not found' })
    }

    if (parsedDayIndex >= schedule.days.length || parsedLessonIndex >= schedule.days[parsedDayIndex].lessons.length) {
      return res.status(404).json({ message: 'Day or lesson not found' })
    }

    if (teacherID) {
      const teacher = await Teacher.findById(teacherID)
      if (!teacher) {
        return res.status(404).json({ message: 'Teacher not found' })
      }
    }

    const lesson = schedule.days[parsedDayIndex].lessons[parsedLessonIndex]
    if (time) lesson.time = time
    if (classroomID) lesson.classroom = classroomID
    if (subject) lesson.subject = subject
    if (teacherID) lesson.teacher = teacherID
    if (lessonType) {
      if (!Object.values(LessonType).includes(lessonType)) {
        return res.status(400).json({
          message: 'Invalid lesson type. Must be one of: ' + Object.values(LessonType).join(', '),
        })
      }
      lesson.lessonType = lessonType
    }
    if (description !== undefined) {
      lesson.description = description
    }

    await schedule.save()

    res.status(200).json({
      message: 'Lesson updated successfully',
    })
  } catch (error) {
    res.status(500).json({
      message: error instanceof Error ? error.message : 'Неизвестная ошибка',
    })
  }
}

const deleteLesson = async (req: Request, res: Response) => {
  try {
    const { scheduleID, dayIndex, lessonIndex } = req.params

    const parsedDayIndex = parseInt(dayIndex)
    const parsedLessonIndex = parseInt(lessonIndex)

    const schedule = await Schedule.findById(scheduleID)

    if (!schedule) {
      return res.status(404).json({ message: 'Schedule not found' })
    }

    if (parsedDayIndex >= schedule.days.length || parsedLessonIndex >= schedule.days[parsedDayIndex].lessons.length) {
      return res.status(404).json({ message: 'Day or lesson not found' })
    }

    schedule.days[parsedDayIndex].lessons.splice(parsedLessonIndex, 1)

    await schedule.save()

    res.status(200).json({
      message: 'Lesson deleted successfully',
    })
  } catch (error) {
    res.status(500).json({
      message: error instanceof Error ? error.message : 'Неизвестная ошибка',
    })
  }
}

export {
  getScheduleById,
  createLesson,
  updateLesson,
  deleteLesson,
  getWeeksByGroupId,
  getGroupsSchedules,
  createWeekSchedule,
  updateWeekSchedule,
  deleteWeekSchedule,
}
