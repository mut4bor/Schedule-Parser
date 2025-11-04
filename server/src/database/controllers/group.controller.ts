import { Group } from '@/database/models/group.model.js'
import { Schedule } from '@/database/models/schedule.model.js'
import { Faculty } from '@/database/models/faculty.model.js'
import { getDatesOfISOWeek } from '@/utils/getDatesOfISOWeek.js'
import { Request, Response } from 'express'
import { EducationType } from '@/database/models/educationType.model.js'
import { Course } from '../models/course.model.js'

const getAllGroups = async (req: Request, res: Response) => {
  try {
    const { educationType, faculty, course } = req.query

    const filter: any = {}
    if (educationType) filter.educationType = educationType
    if (faculty) filter.faculty = faculty
    if (course) filter.course = Number(course)

    const groups = await Group.find(filter)
      .populate('educationType', 'name')
      .populate('faculty', 'name')
      .sort({ course: 1, name: 1 })

    res.status(200).json(groups)
  } catch (error) {
    res.status(500).json({
      message: error instanceof Error ? error.message : 'Неизвестная ошибка',
    })
  }
}

const getGroupById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    if (!id) {
      return res.status(400).json({ message: 'ID обязателен' })
    }

    const group = await Group.findById(id).populate('educationType', 'name').populate('faculty', 'name')

    if (!group) {
      return res.status(404).json({ message: 'Группа не найдена' })
    }

    res.status(200).json(group)
  } catch (error) {
    res.status(500).json({
      message: error instanceof Error ? error.message : 'Неизвестная ошибка',
    })
  }
}

const getWeeksByID = async (req: Request, res: Response) => {
  try {
    const { id } = req.params

    if (!id) {
      return res.status(400).json({ message: 'ID обязателен' })
    }

    const group = await Group.findById(id)
    if (!group) {
      return res.status(404).json({ message: 'Группа не найдена' })
    }

    // Получаем уникальные недели из расписания
    const schedules = await Schedule.find({ group: id }).distinct('date')

    // Преобразуем даты в недели
    const weeksSet = new Set<string>()
    schedules.forEach((date) => {
      const d = new Date(date)
      const year = d.getFullYear()
      const week = getISOWeek(d)
      weeksSet.add(`${year}-W${String(week).padStart(2, '0')}`)
    })

    const weeks = Array.from(weeksSet).sort((a, b) => {
      const [yearA, weekA] = a.split('-W').map(Number)
      const [yearB, weekB] = b.split('-W').map(Number)
      if (yearA !== yearB) return yearA - yearB
      return weekA - weekB
    })

    res.status(200).json(weeks)
  } catch (error) {
    res.status(500).json({
      message: error instanceof Error ? error.message : 'Неизвестная ошибка',
    })
  }
}

const getWeekScheduleByID = async (req: Request<{ id: string; week: string }>, res: Response) => {
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

    const schedules = await Schedule.find({
      group: id,
      date: {
        $gte: dates[0],
        $lte: dates[dates.length - 1],
      },
    })
      .populate('teacher')
      .sort({ date: 1, time: 1 })

    res.status(200).json(schedules)
  } catch (error) {
    res.status(500).json({
      message: error instanceof Error ? error.message : 'Неизвестная ошибка',
    })
  }
}

const getGroupsSchedulesByID = async (req: Request, res: Response) => {
  try {
    const { ids } = req.params

    if (!ids) {
      return res.status(400).json({ message: 'ID обязателен' })
    }

    const idArray = ids.split(',')
    const groups = await Group.find({ _id: { $in: idArray } })
      .populate('educationType', 'name')
      .populate('faculty', 'name')
      .lean()

    if (!groups || groups.length === 0) {
      return res.status(404).json({ message: 'Группы не найдены' })
    }

    const groupsList = groups.map((g) => ({
      id: String(g._id),
      name: g.name || '',
    }))

    // Получаем все расписания для этих групп
    const schedules = await Schedule.find({
      group: { $in: idArray },
    })
      .populate('teacher')
      .lean()

    // Группируем по неделям
    const weeksMap = new Map<string, Map<number, Map<string, Map<string, any>>>>()

    schedules.forEach((schedule) => {
      const date = new Date(schedule.date)
      const year = date.getFullYear()
      const week = getISOWeek(date)
      const weekName = `${year}-W${String(week).padStart(2, '0')}`
      const dayIndex = (date.getDay() + 6) % 7 // Пн=0, Вт=1, ..., Вс=6

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

const createGroup = async (req: Request, res: Response) => {
  try {
    const { name, educationType, faculty, course } = req.body

    if (!name || !educationType || !faculty || !course) {
      return res.status(400).json({
        message: 'Название, тип образования, факультет и курс обязательны',
      })
    }

    const eduType = await EducationType.findById(educationType)
    if (!eduType) {
      return res.status(404).json({
        message: 'Тип образования не найден',
      })
    }

    const facultyDoc = await Faculty.findById(faculty)
    if (!facultyDoc) {
      return res.status(404).json({
        message: 'Факультет не найден',
      })
    }

    const courseDoc = await Course.findById(course)
    if (!courseDoc) {
      return res.status(404).json({
        message: 'Курс не найден',
      })
    }

    const existingGroup = await Group.findOne({
      name: name.trim(),
      educationType,
      faculty,
      course,
    })

    if (existingGroup) {
      return res.status(409).json({
        message: 'Такая группа уже существует',
      })
    }

    const newGroup = new Group({
      name: name.trim(),
      educationType,
      faculty,
      course,
    })

    await newGroup.save()

    res.status(201).json({
      message: 'Группа успешно создана',
    })
  } catch (error) {
    res.status(500).json({
      message: error instanceof Error ? error.message : 'Неизвестная ошибка',
    })
  }
}

const updateGroupById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const { name } = req.body

    const group = await Group.findById(id)

    if (!group) {
      return res.status(404).json({ message: 'Группа не найдена' })
    }

    if (name !== undefined) {
      const existingGroup = await Group.findOne({
        name: name.trim(),
        faculty: group.faculty,
        _id: { $ne: id },
      })
      if (existingGroup) {
        return res.status(409).json({
          message: 'Группа с таким названием уже существует',
        })
      }
      group.name = name.trim()
    }

    await group.save()

    res.status(200).json({
      message: 'Группа успешно изменена',
    })
  } catch (error) {
    res.status(500).json({
      message: error instanceof Error ? error.message : 'Неизвестная ошибка',
    })
  }
}

const deleteGroupById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params

    const group = await Group.findById(id)

    if (!group) {
      return res.status(404).json({ message: 'Группа не найдена' })
    }

    await Schedule.deleteMany({
      group: id,
    })
    await Group.findByIdAndDelete(id)

    res.status(200).json({
      message: 'Группа удалена успешно',
    })
  } catch (error) {
    res.status(500).json({
      message: error instanceof Error ? error.message : 'Неизвестная ошибка',
    })
  }
}

const addWeekNameToGroup = async (req: Request, res: Response) => {
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
    const week = parseInt(weekMatch[2], 10)

    const dates = getDatesOfISOWeek(year, week)

    const existingSchedule = await Schedule.findOne({
      group: id,
      date: {
        $gte: dates[0],
        $lte: dates[dates.length - 1],
      },
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

const updateWeekNameInGroup = async (req: Request, res: Response) => {
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

    // Парсим недели
    const oldMatch = /^(\d{4})-W(\d{2})$/.exec(oldWeekName)
    const newMatch = /^(\d{4})-W(\d{2})$/.exec(newWeekName)

    if (!oldMatch || !newMatch) {
      return res.status(400).json({
        message: 'Неверный формат недели',
      })
    }

    const oldYear = parseInt(oldMatch[1], 10)
    const oldWeek = parseInt(oldMatch[2], 10)
    const newYear = parseInt(newMatch[1], 10)
    const newWeek = parseInt(newMatch[2], 10)

    const oldDates = getDatesOfISOWeek(oldYear, oldWeek)
    const newDates = getDatesOfISOWeek(newYear, newWeek)

    // Получаем все расписания старой недели
    const schedules = await Schedule.find({
      group: id,
      date: {
        $gte: oldDates[0],
        $lte: oldDates[oldDates.length - 1],
      },
    })

    // Обновляем даты
    const updates = schedules.map((schedule) => {
      const oldDate = new Date(schedule.date)
      const dayIndex = (oldDate.getDay() + 6) % 7
      const newDate = newDates[dayIndex]

      return Schedule.findByIdAndUpdate(schedule._id, {
        date: newDate,
      })
    })

    await Promise.all(updates)

    res.status(200).json({
      message: 'Неделя обновлена успешно',
    })
  } catch (error) {
    res.status(500).json({
      message: error instanceof Error ? error.message : 'Неизвестная ошибка',
    })
  }
}

const deleteWeekNameFromGroup = async (req: Request, res: Response) => {
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
    const week = parseInt(weekMatch[2], 10)
    const dates = getDatesOfISOWeek(year, week)

    await Schedule.deleteMany({
      group: id,
      date: {
        $gte: dates[0],
        $lte: dates[dates.length - 1],
      },
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

const createLessonInDay = async (req: Request, res: Response) => {
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

const updateLessonInDay = async (req: Request, res: Response) => {
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

const deleteLessonFromDay = async (req: Request, res: Response) => {
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

// Вспомогательная функция для получения номера недели ISO 8601
function getISOWeek(date: Date): number {
  const target = new Date(date.valueOf())
  const dayNr = (date.getDay() + 6) % 7
  target.setDate(target.getDate() - dayNr + 3)
  const firstThursday = target.valueOf()
  target.setMonth(0, 1)
  if (target.getDay() !== 4) {
    target.setMonth(0, 1 + ((4 - target.getDay() + 7) % 7))
  }
  return 1 + Math.ceil((firstThursday - target.valueOf()) / 604800000)
}

export {
  getAllGroups,
  getGroupById,
  getWeeksByID,
  getWeekScheduleByID,
  getGroupsSchedulesByID,
  createGroup,
  updateGroupById,
  deleteGroupById,
  addWeekNameToGroup,
  updateWeekNameInGroup,
  deleteWeekNameFromGroup,
  createLessonInDay,
  updateLessonInDay,
  deleteLessonFromDay,
}
