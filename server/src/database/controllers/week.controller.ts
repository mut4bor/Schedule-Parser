// controllers/week.controller.ts
import { Group } from '@/database/models/group.model.js'
import { Schedule } from '@/database/models/schedule.model.js'
import { Week } from '@/database/models/week.model.js'
import { getDatesOfISOWeek } from '@/utils/getDatesOfISOWeek.js'
import { Request, Response } from 'express'

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

    const schedules = await Schedule.find({ group: id }).populate('week').distinct('week')

    const weeks = await Week.find({ _id: { $in: schedules } }).sort({
      startDate: 1,
    })

    res.status(200).json(weeks)
  } catch (error) {
    res.status(500).json({
      message: error instanceof Error ? error.message : 'Неизвестная ошибка',
    })
  }
}

const getWeekScheduleByGroupId = async (req: Request, res: Response) => {
  try {
    const { id, week } = req.params

    if (!id || !week) {
      return res.status(400).json({
        message: 'ID и неделя обязательны',
      })
    }

    const group = await Group.findById(id)

    if (!group) {
      return res.status(404).json({ message: 'Группа не найдена' })
    }

    const weekMatch = /^(\d{4})-W(\d{2})$/.exec(week)

    if (!weekMatch) {
      return res.status(400).json({
        message: 'Неверный формат недели. Ожидается YYYY-Www',
      })
    }

    const year = parseInt(weekMatch[1], 10)
    const weekNum = parseInt(weekMatch[2], 10)

    const dates = getDatesOfISOWeek(year, weekNum)

    const weekDoc = await Week.findOne({
      startDate: { $lte: dates[0] },
      endDate: { $gte: dates[dates.length - 1] },
    })

    if (!weekDoc) {
      return res.status(404).json({ message: 'Неделя не найдена' })
    }

    const schedules = await Schedule.find({
      group: id,
      week: weekDoc._id,
    })
      .populate('teacher')
      .sort({ dayOfWeek: 1, time: 1 })

    res.status(200).json(schedules)
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
      .populate('teacher')
      .populate('week')
      .lean()

    const weeksMap = new Map<string, Map<number, Map<string, Map<string, any>>>>()

    schedules.forEach((schedule) => {
      const week = schedule.week as any
      if (!week) return

      const weekName = `${new Date(week.startDate).getFullYear()}-W${String(week.weekNumber).padStart(2, '0')}`
      const dayIndex = schedule.dayOfWeek

      if (!weeksMap.has(weekName)) {
        weeksMap.set(weekName, new Map())
      }
      const weekMap = weeksMap.get(weekName)!

      if (!weekMap.has(dayIndex)) {
        weekMap.set(dayIndex, new Map())
      }
      const dayMap = weekMap.get(dayIndex)!

      const time = schedule.time
      if (!dayMap.has(time)) {
        dayMap.set(time, new Map())
      }
      dayMap.get(time)!.set(String(schedule.group), schedule)
    })

    const dayNames = ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота']

    const weeks = Array.from(weeksMap.entries()).map(([weekName, daysMap]) => {
      const days = Array.from(daysMap.entries())
        .sort(([a], [b]) => a - b)
        .map(([dayIndex, timeSlotsMap]) => ({
          dayName: dayNames[dayIndex] || `День ${dayIndex}`,
          dayIndex,
          timeSlots: Array.from(timeSlotsMap.entries())
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([time, lessonsMap]) => ({
              time,
              lessons: groupsList.map((g) => lessonsMap.get(g.id) || null),
            })),
        }))

      return { weekName, days }
    })

    res.status(200).json({ groups: groupsList, weeks })
  } catch (error) {
    res.status(500).json({
      message: error instanceof Error ? error.message : 'Неизвестная ошибка',
    })
  }
}

const checkWeekAvailability = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const { weekName } = req.body

    if (!id || !weekName) {
      return res.status(400).json({
        message: 'ID группы и неделя обязательны',
      })
    }

    const group = await Group.findById(id)

    if (!group) {
      return res.status(404).json({ message: 'Группа не найдена' })
    }

    const weekMatch = /^(\d{4})-W(\d{2})$/.exec(weekName)

    if (!weekMatch) {
      return res.status(400).json({
        message: 'Неверный формат недели. Ожидается YYYY-Www',
      })
    }

    const year = parseInt(weekMatch[1], 10)
    const weekNum = parseInt(weekMatch[2], 10)

    const dates = getDatesOfISOWeek(year, weekNum)

    const weekDoc = await Week.findOne({
      startDate: { $lte: dates[0] },
      endDate: { $gte: dates[dates.length - 1] },
    })

    if (!weekDoc) {
      return res.status(200).json({
        message: 'Неделя готова к использованию',
      })
    }

    const existingSchedule = await Schedule.findOne({
      group: id,
      week: weekDoc._id,
    })

    if (existingSchedule) {
      return res.status(409).json({
        message: 'Расписание для этой недели уже существует',
      })
    }

    res.status(200).json({
      message: 'Неделя готова к использованию',
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
    const { oldWeekName, newWeekName } = req.body

    if (!id || !oldWeekName || !newWeekName) {
      return res.status(400).json({
        message: 'ID, старая и новая недели обязательны',
      })
    }

    if (oldWeekName === newWeekName) {
      return res.status(400).json({
        message: 'Старая и новая недели не могут совпадать',
      })
    }

    const group = await Group.findById(id)
    if (!group) {
      return res.status(404).json({ message: 'Группа не найдена' })
    }

    const oldMatch = /^(\d{4})-W(\d{2})$/.exec(oldWeekName)
    const newMatch = /^(\d{4})-W(\d{2})$/.exec(newWeekName)

    if (!oldMatch || !newMatch) {
      return res.status(400).json({
        message: 'Неверный формат недели',
      })
    }

    const oldYear = parseInt(oldMatch[1], 10)
    const oldWeekNum = parseInt(oldMatch[2], 10)
    const newYear = parseInt(newMatch[1], 10)
    const newWeekNum = parseInt(newMatch[2], 10)

    const oldDates = getDatesOfISOWeek(oldYear, oldWeekNum)
    const newDates = getDatesOfISOWeek(newYear, newWeekNum)

    const oldWeek = await Week.findOne({
      startDate: { $lte: oldDates[0] },
      endDate: { $gte: oldDates[oldDates.length - 1] },
    })

    if (!oldWeek) {
      return res.status(404).json({ message: 'Старая неделя не найдена' })
    }

    let newWeek = await Week.findOne({
      startDate: { $lte: newDates[0] },
      endDate: { $gte: newDates[newDates.length - 1] },
    })

    if (!newWeek) {
      newWeek = new Week({
        weekNumber: newWeekNum,
        startDate: newDates[0],
        endDate: newDates[newDates.length - 1],
      })
      await newWeek.save()
    }

    await Schedule.updateMany({ group: id, week: oldWeek._id }, { week: newWeek._id })

    res.status(200).json({
      message: 'Неделя обновлена успешно',
    })
  } catch (error) {
    res.status(500).json({
      message: error instanceof Error ? error.message : 'Неизвестная ошибка',
    })
  }
}

const deleteWeekSchedule = async (req: Request, res: Response) => {
  try {
    const { id, weekName } = req.params

    if (!id || !weekName) {
      return res.status(400).json({
        message: 'ID и неделя обязательны',
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
    const weekNum = parseInt(weekMatch[2], 10)
    const dates = getDatesOfISOWeek(year, weekNum)

    const weekDoc = await Week.findOne({
      startDate: { $lte: dates[0] },
      endDate: { $gte: dates[dates.length - 1] },
    })

    if (!weekDoc) {
      return res.status(404).json({ message: 'Неделя не найдена' })
    }

    await Schedule.deleteMany({
      group: id,
      week: weekDoc._id,
    })

    res.status(200).json({
      message: 'Неделя удалена успешно',
    })
  } catch (error) {
    res.status(500).json({
      message: error instanceof Error ? error.message : 'Неизвестная ошибка',
    })
  }
}

export {
  getWeeksByGroupId,
  getWeekScheduleByGroupId,
  getGroupsSchedules,
  checkWeekAvailability,
  updateWeekSchedule,
  deleteWeekSchedule,
}
