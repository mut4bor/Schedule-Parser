import { Group } from '@/database/models/group.model.js'
import { getDatesOfISOWeek } from '@/hooks/getDatesOfISOWeek.js'
import { getFilterParams } from '@/hooks/getFilterParams.js'
import { Request, Response } from 'express'
import { lessonPlaceholder, lessonTimes } from './helpers.js'

const getAllGroups = async (req: Request, res: Response) => {
  try {
    const groups = await Group.find(getFilterParams(req))
    res.status(200).json(groups)
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message })
    } else {
      res.status(500).json({ message: 'An unknown error occurred' })
    }
  }
}

const getGroupById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    if (!id) {
      return res.status(400).json({ message: 'ID is required' })
    }
    const group = await Group.findById(id, {
      dates: 0,
    })

    if (!group) {
      return res.status(404).json({ message: 'Group not found' })
    }

    res.status(200).json(group)
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message })
    } else {
      res.status(500).json({ message: 'An unknown error occurred' })
    }
  }
}

const getWeeksByID = async (req: Request, res: Response) => {
  try {
    const { id } = req.params

    if (!id) {
      return res.status(400).json({ message: 'ID is required' })
    }

    const group = await Group.findById(id)

    if (!group) {
      return res.status(404).json({ message: 'Group not found' })
    }

    if (!group.dates) {
      return res.status(400).json({ message: 'Invalid group dates' })
    }

    const weeks = Array.from(group.dates.keys())

    res.status(200).json(weeks)
  } catch (error) {
    res.status(500).json({
      message: error instanceof Error ? error.message : 'An unknown error occurred',
    })
  }
}

const getWeekScheduleByID = async (req: Request, res: Response) => {
  try {
    const { id, week } = req.params

    if (!id || !week) {
      return res.status(400).json({ message: 'ID and week are required' })
    }

    const group = await Group.findById(id)

    if (!group) {
      return res.status(404).json({ message: 'Group not found' })
    }

    const weekData = group.dates.get(week)

    if (!weekData) {
      return res.status(404).json({ message: 'Week not found' })
    }

    res.status(200).json(weekData)
  } catch (error) {
    res.status(500).json({
      message: error instanceof Error ? error.message : 'An unknown error occurred',
    })
  }
}

const createGroup = async (req: Request, res: Response) => {
  try {
    const { educationType, faculty, course, group } = req.body

    if (!educationType || !faculty || !course || !group) {
      return res.status(400).json({ message: 'educationType, faculty, course, and group are required' })
    }

    const newGroup = new Group({
      educationType,
      faculty,
      course,
      group,
      dates: {
        week: {
          day: {
            time: 'subject',
          },
        },
      },
    })

    await newGroup.save()
    res.status(201).json(newGroup)
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message })
    } else {
      res.status(500).json({ message: 'An unknown error occurred' })
    }
  }
}

const updateGroupById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const group = await Group.findByIdAndUpdate(id, req.body)
    if (!group) {
      return res.status(404).json({ message: 'Group not found' })
    }
    const updatedGroup = await Group.findById(id)
    res.status(200).json(updatedGroup)
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message })
    } else {
      res.status(500).json({ message: 'An unknown error occurred' })
    }
  }
}

const deleteGroupById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const group = await Group.findByIdAndDelete(id)
    if (!group) {
      return res.status(404).json({ message: 'Group not found' })
    }
    res.status(200).json({ message: 'Group deleted successfully' })
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message })
    } else {
      res.status(500).json({ message: 'An unknown error occurred' })
    }
  }
}

const addWeekNameToGroup = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const { weekName } = req.body

    if (!id || !weekName) {
      return res.status(400).json({
        message: 'ID and weekName are required',
      })
    }

    const group = await Group.findById(id)
    if (!group) {
      return res.status(404).json({ message: 'Group not found' })
    }

    // Проверяем формат YYYY-Www
    const weekMatch = /^(\d{4})-W(\d{2})$/.exec(weekName)

    if (weekMatch) {
      const year = parseInt(weekMatch[1], 10)
      const week = parseInt(weekMatch[2], 10)

      const days = getDatesOfISOWeek(year, week) // массив из 7 дат (YYYY-MM-DD)

      // Создаём массив дней
      const weekData = days.map(() => {
        const dayData: { [time: string]: typeof lessonPlaceholder } = {}
        lessonTimes.forEach((t) => {
          dayData[t] = {
            ...lessonPlaceholder,
            teacher: { ...lessonPlaceholder.teacher },
          }
        })
        return dayData
      })

      group.dates.set(weekName, weekData)
    } else {
      // Если это конкретный день (YYYY-MM-DD)
      const dayData: { [time: string]: typeof lessonPlaceholder } = {}
      lessonTimes.forEach((t) => {
        dayData[t] = {
          ...lessonPlaceholder,
          teacher: { ...lessonPlaceholder.teacher },
        }
      })

      // Оборачиваем в массив, т.к. ISchedule = Map<string, IDay[]>
      group.dates.set(weekName, [dayData])
    }

    await group.save()

    res.status(200).json({
      message: 'Week name (or day) added successfully',
      dates: group.dates.get(weekName),
    })
  } catch (error) {
    res.status(500).json({
      message: error instanceof Error ? error.message : 'An unknown error occurred',
    })
  }
}

const updateWeekNameInGroup = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const { oldWeekName, newWeekName } = req.body

    if (!id || !oldWeekName || !newWeekName) {
      return res.status(400).json({
        message: 'ID, oldWeekName, and newWeekName are required',
      })
    }

    const updateResult = await Group.updateOne(
      { _id: id, [`dates.${oldWeekName}`]: { $exists: true } },
      { $rename: { [`dates.${oldWeekName}`]: `dates.${newWeekName}` } },
    )

    if (updateResult.matchedCount === 0) {
      const groupExists = await Group.exists({ _id: id })
      if (!groupExists) {
        return res.status(404).json({ message: 'Group not found' })
      }
      return res.status(404).json({ message: 'Old week name not found' })
    }

    res.status(200).json({
      message: 'Week name updated successfully',
    })
  } catch (error) {
    res.status(500).json({
      message: error instanceof Error ? error.message : 'An unknown error occurred',
    })
  }
}

const deleteWeekNameFromGroup = async (req: Request, res: Response) => {
  try {
    const { id, weekName } = req.params

    if (!id || !weekName) {
      return res.status(400).json({ message: 'ID and weekName are required' })
    }

    const group = await Group.findById(id)
    if (!group) {
      return res.status(404).json({ message: 'Group not found' })
    }

    if (!group.dates.has(weekName)) {
      return res.status(404).json({ message: 'Week name not found' })
    }

    group.dates.delete(weekName)
    await group.save()

    res.status(200).json({ message: 'Week name deleted successfully' })
  } catch (error) {
    res.status(500).json({
      message: error instanceof Error ? error.message : 'An unknown error occurred',
    })
  }
}

const updateLessonInDay = async (req: Request, res: Response) => {
  try {
    const { id, weekName, dayIndex: day, time } = req.params
    const { classroom, teacher, subject, lessonType, newTime } = req.body

    if (!id || !weekName || day === undefined || !time) {
      return res.status(400).json({
        message: 'ID, weekName, day, and time are required',
      })
    }

    const dayIndex = parseInt(day, 10)

    if (isNaN(dayIndex)) {
      return res.status(400).json({ message: 'Day must be a number (index)' })
    }

    const group = await Group.findById(id)
    if (!group) {
      return res.status(404).json({ message: 'Group not found' })
    }

    const weekData = group.dates.get(weekName)
    if (!weekData) {
      return res.status(404).json({ message: 'Week not found' })
    }

    if (!weekData[dayIndex] || !weekData[dayIndex][time]) {
      return res.status(404).json({ message: 'Lesson not found at this time' })
    }

    // Берём старый урок
    const oldLesson = weekData[dayIndex][time]

    // Если нужно поменять время
    const targetTime = newTime || time

    // Удаляем старый ключ, если время изменилось
    if (newTime && newTime !== time) {
      delete weekData[dayIndex][time]
    }

    // Обновляем данные урока
    weekData[dayIndex][targetTime] = {
      classroom: classroom ?? oldLesson.classroom,
      teacher: teacher ?? oldLesson.teacher,
      subject: subject ?? oldLesson.subject,
      lessonType: lessonType ?? oldLesson.lessonType,
    }

    group.dates.set(weekName, weekData)
    group.markModified('dates')
    await group.save()

    res.status(200).json({
      message: 'Lesson updated successfully',
      lesson: weekData[dayIndex][targetTime],
    })
  } catch (error) {
    res.status(500).json({
      message: error instanceof Error ? error.message : 'An unknown error occurred',
    })
  }
}

const deleteLessonFromDay = async (req: Request, res: Response) => {
  try {
    const { id, weekName, dayIndex: day, time } = req.params

    if (!id || !weekName || day === undefined || !time) {
      return res.status(400).json({
        message: 'ID, weekName, day, and time are required',
      })
    }

    const dayIndex = parseInt(day, 10)

    if (isNaN(dayIndex)) {
      return res.status(400).json({ message: 'Day must be a number (index)' })
    }

    const group = await Group.findById(id)
    if (!group) {
      return res.status(404).json({ message: 'Group not found' })
    }

    const weekData = group.dates.get(weekName)
    if (!weekData) {
      return res.status(404).json({ message: 'Week not found' })
    }

    if (!weekData[dayIndex] || !weekData[dayIndex][time]) {
      return res.status(404).json({ message: 'Lesson not found' })
    }

    delete weekData[dayIndex][time]

    group.dates.set(weekName, weekData)
    group.markModified('dates')
    await group.save()

    res.status(200).json({ message: 'Lesson deleted successfully' })
  } catch (error) {
    res.status(500).json({
      message: error instanceof Error ? error.message : 'An unknown error occurred',
    })
  }
}

export {
  getAllGroups,
  getGroupById,
  getWeeksByID,
  getWeekScheduleByID,
  createGroup,
  updateGroupById,
  deleteGroupById,
  addWeekNameToGroup,
  updateWeekNameInGroup,
  deleteWeekNameFromGroup,
  updateLessonInDay,
  deleteLessonFromDay,
}
