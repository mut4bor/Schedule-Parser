import { Group } from '@/database/models/group.model.js'
import { getFilterParams } from '@/utils/getFilterParams.js'
import { Request, Response } from 'express'
import { datesMap } from './helpers.js'

const getCourses = async (req: Request, res: Response) => {
  try {
    const uniqueCourseNumbers = await Group.distinct('course', getFilterParams(req))
    res.status(200).json(uniqueCourseNumbers)
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message })
    } else {
      res.status(500).json({ message: 'An unknown error occurred' })
    }
  }
}

const createCourse = async (req: Request, res: Response) => {
  try {
    const { educationType, faculty, course } = req.body

    if (!educationType || !faculty || !course) {
      return res.status(400).json({
        message: 'educationType, faculty, course are required',
      })
    }

    const newGroup = new Group({
      educationType,
      faculty,
      course,
      group: 'group',
      dates: datesMap,
    })

    await newGroup.save()
    res.status(201).json({
      message: 'Course created successfully',
      group: newGroup,
    })
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message })
    } else {
      res.status(500).json({ message: 'An unknown error occurred' })
    }
  }
}

const updateCourse = async (req: Request, res: Response) => {
  try {
    const { oldCourse, newCourse } = req.body

    if (!oldCourse || !newCourse) {
      return res.status(400).json({
        message: 'oldCourse and newCourse are required',
      })
    }

    const result = await Group.updateMany({ course: oldCourse }, { course: newCourse })

    res.status(200).json({
      message: 'Course updated successfully',
      modifiedCount: result.modifiedCount,
    })
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message })
    } else {
      res.status(500).json({ message: 'An unknown error occurred' })
    }
  }
}

const deleteCourse = async (req: Request, res: Response) => {
  try {
    const { educationType, faculty, course } = req.params

    if (!educationType || !faculty || !course) {
      return res.status(400).json({ message: 'educationType, faculty, and course are required' })
    }

    const result = await Group.deleteMany({ educationType, faculty, course })

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Course not found' })
    }

    res.status(200).json({
      message: 'Course deleted successfully',
      deletedCount: result.deletedCount,
    })
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message })
    } else {
      res.status(500).json({ message: 'An unknown error occurred' })
    }
  }
}

const getGroupsByCourse = async (req: Request, res: Response) => {
  try {
    const { course } = req.params

    if (!course) {
      return res.status(400).json({ message: 'Course is required' })
    }

    const groups = await Group.find({ course }, { dates: 0 })
    res.status(200).json(groups)
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message })
    } else {
      res.status(500).json({ message: 'An unknown error occurred' })
    }
  }
}

export { getCourses, createCourse, updateCourse, deleteCourse, getGroupsByCourse }
