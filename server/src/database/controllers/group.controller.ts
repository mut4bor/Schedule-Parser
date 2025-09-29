import { Group } from '@/database/models/group.model.js'
import { getDatesOfISOWeek } from '@/utils/getDatesOfISOWeek.js'
import { getFilterParams } from '@/utils/getFilterParams.js'
import { Request, Response } from 'express'
import { datesMap, lessonPlaceholder, lessonTimes } from './helpers.js'
import { IDay, ILesson, IWeek } from '@/types/index.js'

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
      dates: datesMap,
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

    const weekMatch = /^(\d{4})-W(\d{2})$/.exec(weekName)
    if (!weekMatch) {
      return res.status(400).json({
        message: 'Invalid week format. Expected YYYY-Www',
      })
    }

    const year = parseInt(weekMatch[1], 10)
    const week = parseInt(weekMatch[2], 10)

    const days = getDatesOfISOWeek(year, week)

    const weekData: IWeek = days.map((): IDay => {
      return lessonTimes.map(
        (time): ILesson => ({
          time,
          ...lessonPlaceholder,
          teacher: { ...lessonPlaceholder.teacher },
        }),
      )
    })

    group.dates.set(weekName, weekData)

    await group.save()

    res.status(200).json({
      message: 'Week added successfully',
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

    if (oldWeekName === newWeekName) {
      return res.status(400).json({
        message: 'oldWeekName and newWeekName cannot be the same',
      })
    }

    const group = await Group.findById(id).lean()
    if (!group) {
      return res.status(404).json({ message: 'Group not found' })
    }

    if (group.dates && group.dates[newWeekName]) {
      return res.status(400).json({
        message: `Week name "${newWeekName}" already exists`,
      })
    }

    const updateResult = await Group.updateOne(
      { _id: id, [`dates.${oldWeekName}`]: { $exists: true } },
      { $rename: { [`dates.${oldWeekName}`]: `dates.${newWeekName}` } },
    )

    if (updateResult.matchedCount === 0) {
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

    await Group.findByIdAndUpdate(id, { $unset: { [`dates.${weekName}`]: '' } }, { new: true })

    res.status(200).json({ message: 'Week name deleted successfully' })
  } catch (error) {
    res.status(500).json({
      message: error instanceof Error ? error.message : 'An unknown error occurred',
    })
  }
}

const createLessonInDay = async (req: Request, res: Response) => {
  try {
    const { id, weekName, dayIndex: day } = req.params
    const { time } = req.body

    if (!id || !weekName || day === undefined || day === '-1') {
      return res.status(400).json({
        message: 'Group ID, weekName, and day are required',
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

    const dayData = weekData[dayIndex]
    if (!dayData) {
      return res.status(404).json({ message: 'Day not found' })
    }

    const newLesson: ILesson = {
      ...lessonPlaceholder,
      time,
    }

    dayData.push(newLesson)

    weekData[dayIndex] = dayData
    group.dates.set(weekName, weekData)
    group.markModified('dates')
    await group.save()

    res.status(201).json({
      message: 'Lesson created successfully',
      lesson: newLesson,
    })
  } catch (error) {
    res.status(500).json({
      message: error instanceof Error ? error.message : 'An unknown error occurred',
    })
  }
}

const updateLessonInDay = async (req: Request, res: Response) => {
  try {
    const { id, weekName, dayIndex: day, lessonId } = req.params
    const { classroom, teacher, subject, lessonType, time } = req.body

    if (!id || !weekName || day === undefined || day === '-1' || !lessonId) {
      return res.status(400).json({
        message: 'Group ID, weekName, day, and lessonId are required',
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

    const dayData = weekData[dayIndex]
    if (!dayData) {
      return res.status(404).json({ message: 'Day not found' })
    }

    const lessonIndex = dayData.findIndex((l) => String(l._id) === lessonId)
    if (lessonIndex === -1) {
      return res.status(404).json({ message: 'Lesson not found by _id' })
    }

    const oldLesson = dayData[lessonIndex]

    const updatedLesson: ILesson = {
      ...oldLesson,
      time,
      classroom,
      teacher,
      subject,
      lessonType,
    }

    dayData[lessonIndex] = updatedLesson

    weekData[dayIndex] = dayData
    group.dates.set(weekName, weekData)
    group.markModified('dates')
    await group.save()

    res.status(200).json({ message: 'Lesson updated successfully' })
  } catch (error) {
    res.status(500).json({
      message: error instanceof Error ? error.message : 'An unknown error occurred',
    })
  }
}

const deleteLessonFromDay = async (req: Request, res: Response) => {
  try {
    const { id, weekName, dayIndex: day, lessonId } = req.params

    if (!id || !weekName || day === undefined || !lessonId) {
      return res.status(400).json({
        message: 'Group ID, weekName, day, and lessonId are required',
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
      return res.status(404).json({ message: 'Group not found' })
    }

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
  createLessonInDay,
  updateLessonInDay,
  deleteLessonFromDay,
}
