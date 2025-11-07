import { Group } from '@/database/models/group.model.js'
import { Schedule } from '@/database/models/schedule.model.js'
import { getDatesOfISOWeek } from '@/utils/getDatesOfISOWeek.js'
import { Request, Response } from 'express'

const createLesson = async (req: Request, res: Response) => {
  try {
    const { id, weekName, dayIndex: day } = req.params
    const { time, classroom, teacherID, subject, lessonType } = req.body

    if (!id || !weekName || day === undefined || !time || !classroom || !teacherID || !subject || !lessonType) {
      return res.status(400).json({
        message: 'Все поля обязательны',
      })
    }

    const dayIndex = parseInt(day, 10)

    if (isNaN(dayIndex) || dayIndex < 0 || dayIndex > 6) {
      return res.status(400).json({
        message: 'dayIndex должен быть числом от 0 до 6',
      })
    }

    const group = await Group.findById(id)
    if (!group) {
      return res.status(404).json({ message: 'Группа не найдена' })
    }

    const weekMatch = /^(\d{4})-W(\d{2})$/.exec(weekName)
    if (!weekMatch) {
      return res.status(400).json({
        message: 'Неверный формат недели',
      })
    }

    const year = parseInt(weekMatch[1], 10)
    const week = parseInt(weekMatch[2], 10)
    const dates = getDatesOfISOWeek(year, week)
    const lessonDate = dates[dayIndex]

    const newSchedule = new Schedule({
      group: id,
      teacher: teacherID,
      date: lessonDate,
      time,
      classroom,
      subject,
      lessonType,
    })

    await newSchedule.save()

    return res.status(201).json({
      message: 'Урок создан успешно',
    })
  } catch (error) {
    return res.status(500).json({
      message: error instanceof Error ? error.message : 'Неизвестная ошибка',
    })
  }
}

const updateLesson = async (req: Request, res: Response) => {
  try {
    const { lessonId } = req.params
    const { classroom, teacherID, subject, lessonType, time } = req.body

    if (!lessonId) {
      return res.status(400).json({
        message: 'ID урока обязателен',
      })
    }

    const schedule = await Schedule.findById(lessonId)
    if (!schedule) {
      return res.status(404).json({ message: 'Урок не найден' })
    }

    if (time) schedule.time = time
    if (classroom) schedule.classroom = classroom
    if (teacherID) schedule.teacher = teacherID
    if (subject) schedule.subject = subject
    if (lessonType) schedule.lessonType = lessonType

    await schedule.save()

    res.status(200).json({
      message: 'Урок обновлен успешно',
    })
  } catch (error) {
    res.status(500).json({
      message: error instanceof Error ? error.message : 'Неизвестная ошибка',
    })
  }
}

const deleteLesson = async (req: Request, res: Response) => {
  try {
    const { lessonId } = req.params

    if (!lessonId) {
      return res.status(400).json({
        message: 'ID урока обязателен',
      })
    }

    const schedule = await Schedule.findByIdAndDelete(lessonId)
    if (!schedule) {
      return res.status(404).json({ message: 'Урок не найден' })
    }

    res.status(200).json({ message: 'Урок удален успешно' })
  } catch (error) {
    res.status(500).json({
      message: error instanceof Error ? error.message : 'Неизвестная ошибка',
    })
  }
}

export { createLesson, updateLesson, deleteLesson }
