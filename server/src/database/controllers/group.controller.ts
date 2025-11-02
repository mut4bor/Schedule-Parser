import { Group } from '@/database/models/group.model.js'
import { getDatesOfISOWeek } from '@/utils/getDatesOfISOWeek.js'
import { getFilterParams } from '@/utils/getFilterParams.js'
import { Request, Response } from 'express'

import { ILesson, IWeek } from '@/types/index.js'

const getAllGroups = async (req: Request, res: Response) => {
  try {
    const groups = await Group.find(getFilterParams(req))
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
    res.status(500).json({
      message: error instanceof Error ? error.message : 'Неизвестная ошибка',
    })
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
      return res.status(404).json({ message: 'Группа не найдена' })
    }

    if (!group.dates) {
      return res.status(400).json({ message: 'Неверные даты группы' })
    }

    const weeks = Array.from(group.dates.keys()).sort((a, b) => {
      const [yearA, weekA] = a.split('-W').map(Number)
      const [yearB, weekB] = b.split('-W').map(Number)

      if (yearA !== yearB) {
        return yearA - yearB
      }
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
      return res.status(400).json({ message: 'ID and week are required' })
    }

    const group = await Group.findById(id).populate({
      path: `dates.${week}.teacher`,
      model: 'Teacher',
    })

    if (!group) {
      return res.status(404).json({ message: 'Группа не найдена' })
    }

    const weekData = group.dates.get(week)

    if (!weekData) {
      return res.status(404).json({ message: 'Неделя не найдена' })
    }

    res.status(200).json(weekData)
  } catch (error) {
    res.status(500).json({
      message: error instanceof Error ? error.message : 'Неизвестная ошибка',
    })
  }
}

interface IGroupsSchedule {
  weekName: 'even' | 'odd' | string
  dates: {
    time: string // ключ = время пары
    lessons: {
      groupName: string
      groupID: string
      lesson: ILesson | null
    }[]
  }[][] // [день][слот времени]
}

const getGroupsSchedulesByID = async (req: Request, res: Response) => {
  try {
    const { ids } = req.params

    if (!ids) {
      return res.status(400).json({ message: 'ID обязателен' })
    }

    const idArray = ids.split(',')
    const groups = await Group.find({ _id: { $in: idArray } }).lean()

    if (!groups || groups.length === 0) {
      return res.status(404).json({ message: 'Группы не найдены' })
    }

    const schedules: IGroupsSchedule[] = []

    for (const group of groups) {
      const { _id: groupID, groupName, dates } = group

      // const test = group.

      // dates — Map('weekName' -> IWeek)
      for (const [weekName, weekData] of Object.entries(dates || {})) {
        let targetWeek = schedules.find((w) => w.weekName === weekName)

        if (!targetWeek) {
          targetWeek = { weekName, dates: [] }
          schedules.push(targetWeek)
        }

        weekData.forEach((day: ILesson[], dayIndex: number) => {
          if (!targetWeek!.dates[dayIndex]) {
            targetWeek!.dates[dayIndex] = []
          }

          const currentDay = targetWeek!.dates[dayIndex]

          day.forEach((lesson) => {
            if (!lesson) {
              return
            }

            const lessonTime: string = lesson.time || 'unknown'

            // Ищем, есть ли уже запись по этому времени
            let timeSlot = currentDay.find((slot) => slot.time === lessonTime)

            if (!timeSlot) {
              timeSlot = { time: lessonTime, lessons: [] }
              currentDay.push(timeSlot)
            }

            // Добавляем информацию о группе и уроке
            timeSlot.lessons.push({
              groupName: groupName || '',
              lesson,
              groupID: String(groupID),
            })
          })
        })
      }
    }

    res.status(200).json(schedules)
  } catch (error) {
    res.status(500).json({
      message: error instanceof Error ? error.message : 'Неизвестная ошибка',
    })
  }
}

const createGroup = async (req: Request, res: Response) => {
  try {
    const { educationType, faculty, course, groupName } = req.body

    if (!educationType || !faculty || !course || !groupName) {
      return res.status(400).json({ message: 'Тип образования, факультет, курс и группа обязательны' })
    }

    const newGroup = new Group({
      educationType,
      faculty,
      course,
      groupName,
      dates: {},
    })

    await newGroup.save()
    res.status(201).json(newGroup)
  } catch (error) {
    res.status(500).json({
      message: error instanceof Error ? error.message : 'Неизвестная ошибка',
    })
  }
}

const updateGroupById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const group = await Group.findByIdAndUpdate(id, req.body)
    if (!group) {
      return res.status(404).json({ message: 'Группа не найдена' })
    }
    const updatedGroup = await Group.findById(id)
    res.status(200).json(updatedGroup)
  } catch (error) {
    res.status(500).json({
      message: error instanceof Error ? error.message : 'Неизвестная ошибка',
    })
  }
}

const deleteGroupById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params

    const group = await Group.findByIdAndDelete(id)

    if (!group) {
      return res.status(404).json({ message: 'Группа не найдена' })
    }

    res.status(200).json({ message: 'Group deleted successfully' })
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

    if (!id) {
      return res.status(400).json({
        message: 'ID группы обязателен',
      })
    }
    if (!weekName) {
      return res.status(400).json({
        message: 'Неделя обязательна',
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

    const days = getDatesOfISOWeek(year, week)

    const weekData: IWeek = days.map(() => [])

    group.dates.set(weekName, weekData)

    await group.save()

    res.status(200).json({
      message: 'Неделя добавлена успешно',
      dates: group.dates.get(weekName),
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
        message: 'ID, старый weekName и новый weekName обязательны',
      })
    }

    if (oldWeekName === newWeekName) {
      return res.status(400).json({
        message: 'Старый weekName и новый weekName не могут быть одинаковыми',
      })
    }

    const group = await Group.findById(id).lean()
    if (!group) {
      return res.status(404).json({ message: 'Группа не найдена' })
    }

    if (group.dates && group.dates[newWeekName]) {
      return res.status(400).json({
        message: `Неделя "${newWeekName}" уже существует`,
      })
    }

    const updateResult = await Group.updateOne(
      { _id: id, [`dates.${oldWeekName}`]: { $exists: true } },
      { $rename: { [`dates.${oldWeekName}`]: `dates.${newWeekName}` } },
    )

    if (updateResult.matchedCount === 0) {
      return res.status(404).json({ message: 'Старый weekName не найден' })
    }

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
      return res.status(400).json({ message: 'ID и weekName обязательны' })
    }

    await Group.findByIdAndUpdate(id, { $unset: { [`dates.${weekName}`]: '' } }, { new: true })

    res.status(200).json({ message: 'Неделя удалена успешно' })
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

    // Проверяем каждый параметр из req.params
    if (!id) {
      return res.status(400).json({ message: 'Параметр id (ID группы) обязателен' })
    }

    if (!weekName) {
      return res.status(400).json({ message: 'Параметр weekName (неделя) обязателен' })
    }

    if (day === undefined || day === '-1') {
      return res.status(400).json({ message: 'Параметр day (день недели) обязателен' })
    }

    // Проверяем каждый параметр из req.body
    if (!time) {
      return res.status(400).json({ message: 'Поле time (время) обязательно' })
    }

    if (!classroom) {
      return res.status(400).json({ message: 'Поле classroom (аудитория) обязательно' })
    }

    if (!teacherID) {
      return res.status(400).json({ message: 'Поле teacher (преподаватель) обязательно' })
    }

    if (!subject) {
      return res.status(400).json({ message: 'Поле subject (предмет) обязательно' })
    }

    if (!lessonType) {
      return res.status(400).json({ message: 'Поле lessonType (тип занятия) обязательно' })
    }

    const dayIndex = parseInt(day, 10)

    if (isNaN(dayIndex)) {
      return res.status(400).json({ message: 'dayIndex должен быть числом' })
    }

    const group = await Group.findById(id)
    if (!group) {
      return res.status(404).json({ message: 'Группа не найдена' })
    }

    const weekData = group.dates.get(weekName)
    if (!weekData) {
      return res.status(404).json({ message: 'Неделя не найдена' })
    }

    const dayData = weekData[dayIndex]
    if (!Array.isArray(dayData)) {
      return res.status(404).json({ message: 'День не найден' })
    }

    dayData.push({
      time,
      classroom,
      teacher: teacherID,
      subject,
      lessonType,
    })
    weekData[dayIndex] = dayData

    group.dates.set(weekName, weekData)
    group.markModified('dates')
    await group.save()

    return res.status(201).json({
      message: 'Урок создан успешно',
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({
      message: error instanceof Error ? error.message : 'Неизвестная ошибка',
    })
  }
}

const updateLessonInDay = async (req: Request, res: Response) => {
  try {
    const { id, weekName, dayIndex: day, lessonId } = req.params
    const { classroom, teacherID, subject, lessonType, time } = req.body

    if (!id) {
      return res.status(400).json({
        message: 'Параметр id (ID группы) обязателен',
      })
    }

    if (!weekName) {
      return res.status(400).json({
        message: 'Параметр weekName обязателен',
      })
    }

    if (day === undefined || day === '-1') {
      return res.status(400).json({
        message: 'Параметр day (день недели) обязателен и не должен быть -1',
      })
    }

    if (!lessonId) {
      return res.status(400).json({
        message: 'Параметр lessonId (ID урока) обязателен',
      })
    }

    const dayIndex = parseInt(day, 10)

    if (isNaN(dayIndex)) {
      return res.status(400).json({ message: 'Day must be a number (index)' })
    }

    const group = await Group.findById(id)

    if (!group) {
      return res.status(404).json({ message: 'Группа не найдена' })
    }

    const weekData = group.dates.get(weekName)
    if (!weekData) {
      return res.status(404).json({ message: 'Неделя не найдена' })
    }

    const dayData = weekData[dayIndex]
    if (!dayData) {
      return res.status(404).json({ message: 'День не найден' })
    }

    const lessonIndex = dayData.findIndex((lesson) => {
      if (!lesson) {
        return
      }

      return String(lesson._id) === lessonId
    })
    if (lessonIndex === -1) {
      return res.status(404).json({ message: 'Урок не найден по _id' })
    }

    const oldLesson = dayData[lessonIndex]

    dayData[lessonIndex] = {
      ...oldLesson,
      time,
      classroom,
      teacher: teacherID,
      subject,
      lessonType,
    }

    weekData[dayIndex] = dayData
    group.dates.set(weekName, weekData)
    group.markModified('dates')
    await group.save()

    res.status(200).json({ message: 'Урок обновлен успешно' })
  } catch (error) {
    res.status(500).json({
      message: error instanceof Error ? error.message : 'Неизвестная ошибка',
    })
  }
}

const deleteLessonFromDay = async (req: Request, res: Response) => {
  try {
    const { id, weekName, dayIndex: day, lessonId } = req.params

    if (!id || !weekName || day === undefined || !lessonId) {
      return res.status(400).json({
        message: 'ID группы, weekName, день и ID урока обязательны',
      })
    }

    const dayIndex = parseInt(day, 10)
    if (isNaN(dayIndex)) {
      return res.status(400).json({ message: 'Day must be a number (index)' })
    }

    const updatedGroup = await Group.findOneAndUpdate(
      { _id: id },
      {
        $pull: {
          [`dates.${weekName}.${dayIndex}`]: { _id: lessonId },
        },
      },
      { new: true },
    )

    if (!updatedGroup) {
      return res.status(404).json({ message: 'Группа не найдена' })
    }

    res.status(200).json({ message: 'Урок удален успешно' })
  } catch (error) {
    res.status(500).json({
      message: error instanceof Error ? error.message : 'Неизвестная ошибка',
    })
  }
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
