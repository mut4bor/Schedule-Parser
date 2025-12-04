import { Request, Response } from 'express'
import { Classroom } from '@/database/models/classroom.model.js'
import { Schedule } from '@/database/models/schedule.model.js'
import { dayNames, TimeSlots } from '@/types/index.js'

const getAllClassrooms = async (req: Request, res: Response) => {
  try {
    const classrooms = await Classroom.find().lean()
    res.status(200).json(classrooms)
  } catch (error) {
    res.status(500).json({
      message: error instanceof Error ? error.message : 'Неизвестная ошибка',
    })
  }
}

const getClassroomById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const classroom = await Classroom.findById(id)
    if (!classroom) {
      return res.status(404).json({ message: 'Аудитория не найдена' })
    }
    res.status(200).json(classroom)
  } catch (error: any) {
    res.status(500).json({
      message: error instanceof Error ? error.message : 'Неизвестная ошибка',
    })
  }
}

const getClassroomsSchedules = async (req: Request, res: Response) => {
  try {
    const { ids } = req.params

    if (!ids) {
      return res.status(400).json({ message: 'ID обязателен' })
    }

    const idArray = ids
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)

    const classrooms = await Classroom.find({
      _id: { $in: idArray },
    }).lean()

    if (!classrooms || classrooms.length === 0) {
      return res.status(404).json({ message: 'Аудитории не найдены' })
    }

    const classroomsList = classrooms.map((c) => ({
      id: String(c._id),
      name: c.name || '',
      capacity: typeof c.capacity === 'number' ? c.capacity : null,
      description: c.description || '',
    }))

    const schedules = await Schedule.find({
      'days.lessons.classroom': { $in: idArray },
    })
      .populate('group')
      .populate('days.lessons.teacher')
      .populate('days.lessons.classroom')
      .lean()

    const weekMap = new Map<string, { weekName: string; isActive: boolean; schedules: any[] }>()

    schedules.forEach((schedule: any) => {
      const weekKey = schedule.weekName
      if (!weekMap.has(weekKey)) {
        weekMap.set(weekKey, {
          weekName: schedule.weekName,
          isActive: schedule.isActive,
          schedules: [],
        })
      }
      weekMap.get(weekKey)!.schedules.push(schedule)
    })

    const weeks = Array.from(weekMap.values()).map((week) => {
      const days = dayNames.map((dayName: string, dayIndex: number) => {
        const timeSlots = TimeSlots.map((time: string) => {
          const lessons = classroomsList.map((classroom) => {
            const classroomLessons = week.schedules
              .flatMap((schedule: any) => {
                const day = schedule.days.find((d: any) => d.dayOfWeek === dayIndex)
                if (!day) return []

                return day.lessons
                  .filter((l: any) => {
                    if (!l.time || !l.classroom) return false
                    const classroomId = typeof l.classroom === 'object' ? String(l.classroom._id) : String(l.classroom)
                    return l.time === time && classroomId === classroom.id
                  })
                  .map((lesson: any) => ({
                    subject: lesson.subject,
                    teacher: lesson.teacher,
                    lessonType: lesson.lessonType,
                    group: schedule.group,
                  }))
              })
              .filter(Boolean)

            return classroomLessons.length > 0 ? classroomLessons : null
          })

          return { time, lessons }
        })

        return { dayName, dayIndex, timeSlots }
      })

      return {
        weekName: week.weekName,
        isActive: week.isActive,
        days,
      }
    })

    res.status(200).json({ classrooms: classroomsList, weeks })
  } catch (error) {
    res.status(500).json({
      message: error instanceof Error ? error.message : 'Неизвестная ошибка',
    })
  }
}

const createClassroom = async (req: Request, res: Response) => {
  try {
    const { name, capacity, description } = req.body

    if (!name || !capacity) {
      return res.status(400).json({
        message: 'name и capacity обязательны',
      })
    }

    const exists = await Classroom.findOne({ name }).lean()
    if (exists) {
      return res.status(409).json({ message: 'Аудитория с таким именем уже есть' })
    }

    const created = await Classroom.create({
      name,
      capacity,
      description,
    })

    res.status(201).json(created)
  } catch (error) {
    res.status(500).json({
      message: error instanceof Error ? error.message : 'Неизвестная ошибка',
    })
  }
}

const updateClassroom = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const { name, capacity, description } = req.body

    const classroom = await Classroom.findById(id)
    if (!classroom) {
      return res.status(404).json({ message: 'Аудитория не найдена' })
    }

    if (name && name !== classroom.name) {
      const exists = await Classroom.findOne({ name }).lean()
      if (exists) {
        return res.status(409).json({
          message: 'Аудитория с таким именем уже есть',
        })
      }
    }

    classroom.name = name ?? classroom.name
    classroom.capacity = capacity ?? classroom.capacity
    classroom.description = description ?? classroom.description

    await classroom.save()

    res.status(200).json(classroom)
  } catch (error) {
    res.status(500).json({
      message: error instanceof Error ? error.message : 'Неизвестная ошибка',
    })
  }
}

const deleteClassroom = async (req: Request, res: Response) => {
  try {
    const { id } = req.params

    const classroom = await Classroom.findById(id)
    if (!classroom) {
      return res.status(404).json({ message: 'Аудитория не найдена' })
    }

    await classroom.deleteOne()
    res.status(200).json({ success: true })
  } catch (error) {
    res.status(500).json({
      message: error instanceof Error ? error.message : 'Неизвестная ошибка',
    })
  }
}

export { getAllClassrooms, getClassroomById, getClassroomsSchedules, createClassroom, updateClassroom, deleteClassroom }
