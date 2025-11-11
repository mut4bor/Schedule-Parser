import { Request, Response } from 'express'
import { Teacher } from '@/database/models/teacher.model.js'
import { Schedule } from '../models/schedule.model.js'
import { dayNames, ISchedule, TimeSlots } from '@/types/index.js'

const getAllTeachers = async (_req: Request, res: Response) => {
  try {
    const teachers = await Teacher.find().sort({ createdAt: -1 })
    res.status(200).json(teachers)
  } catch (error: any) {
    res.status(500).json({
      message: error instanceof Error ? error.message : 'Неизвестная ошибка',
    })
  }
}

const getTeacherById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const teacher = await Teacher.findById(id)
    if (!teacher) {
      return res.status(404).json({ message: 'Преподаватель не найден' })
    }
    res.status(200).json(teacher)
  } catch (error: any) {
    res.status(500).json({
      message: error instanceof Error ? error.message : 'Неизвестная ошибка',
    })
  }
}

const getTeachersSchedules = async (req: Request, res: Response) => {
  try {
    const { ids } = req.params

    if (!ids) {
      return res.status(400).json({ message: 'ID обязателен' })
    }

    const idArray = ids.split(',')
    const teachers = await Teacher.find({ _id: { $in: idArray } }).lean()

    if (!teachers || teachers.length === 0) {
      return res.status(404).json({ message: 'Преподаватели не найдены' })
    }

    const teachersList = teachers.map((t) => ({
      id: String(t._id),
      firstName: t.firstName || '',
      middleName: t.middleName || '',
      lastName: t.lastName || '',
      title: t.title || '',
    }))

    const schedules = await Schedule.find({
      'days.lessons.teacher': { $in: idArray },
    })
      .populate('group')
      .populate('days.lessons.teacher')
      .lean()

    const weekMap = new Map()

    schedules.forEach((schedule) => {
      const weekKey = schedule.weekName
      if (!weekMap.has(weekKey)) {
        weekMap.set(weekKey, {
          weekName: schedule.weekName,
          isActive: schedule.isActive,
          schedules: [],
        })
      }
      weekMap.get(weekKey).schedules.push(schedule)
    })

    const weeks = Array.from(weekMap.values()).map((week) => {
      const days = dayNames.map((dayName, dayIndex) => {
        const timeSlots = TimeSlots.map((time) => {
          const lessons = teachersList.map((teacher) => {
            const teacherLessons = week.schedules
              .flatMap((schedule: ISchedule) => {
                const day = schedule.days.find((d) => d.dayOfWeek === dayIndex)
                if (!day) return []

                return day.lessons
                  .filter((l) => {
                    if (!l.time || !l.teacher) return false
                    return l.time === time && String(l.teacher._id || l.teacher) === teacher.id
                  })
                  .map((lesson) => ({
                    subject: lesson.subject,
                    classroom: lesson.classroom,
                    lessonType: lesson.lessonType,
                    group: schedule.group,
                  }))
              })
              .filter(Boolean)

            return teacherLessons.length > 0 ? teacherLessons : null
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

    res.status(200).json({ teachers: teachersList, weeks })
  } catch (error) {
    res.status(500).json({
      message: error instanceof Error ? error.message : 'Неизвестная ошибка',
    })
  }
}

const createTeacher = async (req: Request, res: Response) => {
  try {
    const { firstName, middleName, lastName, title } = req.body

    await Teacher.create({
      firstName,
      middleName,
      lastName,
      title,
    })

    res.status(201).json({ message: 'Преподаватель успешно создан' })
  } catch (error: any) {
    res.status(500).json({
      message: error instanceof Error ? error.message : 'Неизвестная ошибка',
    })
  }
}

const updateTeacher = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const { firstName, middleName, lastName, title } = req.body

    const teacher = await Teacher.findByIdAndUpdate(
      id,
      { firstName, middleName, lastName, title },
      { new: true, runValidators: true },
    )

    if (!teacher) {
      return res.status(404).json({ message: 'Преподаватель не найден' })
    }

    res.status(200).json({ message: 'Преподаватель успешно обновлен' })
  } catch (error: any) {
    res.status(500).json({
      message: error instanceof Error ? error.message : 'Неизвестная ошибка',
    })
  }
}

const deleteTeacher = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const teacher = await Teacher.findByIdAndDelete(id)

    if (!teacher) {
      return res.status(404).json({ message: 'Преподаватель не найден' })
    }

    res.status(200).json({ message: 'Преподаватель успешно удален' })
  } catch (error: any) {
    res.status(500).json({
      message: error instanceof Error ? error.message : 'Неизвестная ошибка',
    })
  }
}

export { getAllTeachers, getTeacherById, getTeachersSchedules, createTeacher, updateTeacher, deleteTeacher }
