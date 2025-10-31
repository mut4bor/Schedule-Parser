import { Group } from '@/database/models/group.model.js'
import { getFilterParams } from '@/utils/getFilterParams.js'
import { Request, Response } from 'express'

const getCourses = async (req: Request, res: Response) => {
  try {
    const uniqueCourseNumbers = await Group.distinct('course', getFilterParams(req))
    res.status(200).json(uniqueCourseNumbers)
  } catch (error) {
    res.status(500).json({
      message: error instanceof Error ? error.message : 'Неизвестная ошибка',
    })
  }
}

const createCourse = async (req: Request, res: Response) => {
  try {
    const { educationType, faculty, course } = req.body

    if (!educationType || !faculty || !course) {
      return res.status(400).json({
        message: 'Тип образования, факультет и курс обязательны',
      })
    }

    const newGroup = new Group({
      educationType,
      faculty,
      course,
      groupName: null,
      dates: {},
    })

    await newGroup.save()
    res.status(201).json({
      message: 'Курс создан успешно',
      groupName: newGroup,
    })
  } catch (error) {
    res.status(500).json({
      message: error instanceof Error ? error.message : 'Неизвестная ошибка',
    })
  }
}

const updateCourse = async (req: Request, res: Response) => {
  try {
    const { educationType, faculty, oldCourse, newCourse } = req.body

    if (!educationType || !faculty) {
      return res.status(400).json({
        message: 'Тип образования и факультет обязательны',
      })
    }

    if (!oldCourse || !newCourse) {
      return res.status(400).json({
        message: 'Старый курс и новый курс обязательны',
      })
    }

    const result = await Group.updateMany({ educationType, faculty, course: oldCourse }, { course: newCourse })

    res.status(200).json({
      message: 'Курс обновлен успешно',
      modifiedCount: result.modifiedCount,
    })
  } catch (error) {
    res.status(500).json({
      message: error instanceof Error ? error.message : 'Неизвестная ошибка',
    })
  }
}

const deleteCourse = async (req: Request, res: Response) => {
  try {
    const { educationType, faculty, course } = req.params

    if (!educationType || !faculty || !course) {
      return res.status(400).json({ message: 'Тип образования, факультет и курс обязательны' })
    }

    const result = await Group.deleteMany({ educationType, faculty, course })

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Курс не найден' })
    }

    res.status(200).json({
      message: 'Курс удален успешно',
      deletedCount: result.deletedCount,
    })
  } catch (error) {
    res.status(500).json({
      message: error instanceof Error ? error.message : 'Неизвестная ошибка',
    })
  }
}

const getGroupsByCourse = async (req: Request, res: Response) => {
  try {
    const { course } = req.params

    if (!course) {
      return res.status(400).json({ message: 'Курс обязателен' })
    }

    const groups = await Group.find({ course }, { dates: 0 })
    res.status(200).json(groups)
  } catch (error) {
    res.status(500).json({
      message: error instanceof Error ? error.message : 'Неизвестная ошибка',
    })
  }
}

export { getCourses, createCourse, updateCourse, deleteCourse, getGroupsByCourse }
