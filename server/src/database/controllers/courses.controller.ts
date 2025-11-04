import { Course } from '@/database/models/course.model.js'
import { Group } from '@/database/models/group.model.js'
import { Schedule } from '@/database/models/schedule.model.js'
import { Faculty } from '@/database/models/faculty.model.js'
import { Request, Response } from 'express'
import { getFilterParams } from '@/utils/getFilterParams.js'

const getCourses = async (req: Request, res: Response) => {
  try {
    const courses = await Course.find(getFilterParams(req))

    res.status(200).json(courses)
  } catch (error) {
    res.status(500).json({
      message: error instanceof Error ? error.message : 'Неизвестная ошибка',
    })
  }
}

const createCourse = async (req: Request, res: Response) => {
  try {
    const { name, facultyId } = req.body

    if (!facultyId) {
      return res.status(400).json({
        message: 'ID факультета обязателен',
      })
    }

    if (!name || !name.trim()) {
      return res.status(400).json({
        message: 'Название курса обязательно',
      })
    }

    const faculty = await Faculty.findById(facultyId)

    if (!faculty) {
      return res.status(404).json({
        message: 'Факультет не найден',
      })
    }

    const existingCourse = await Course.findOne({
      name: name.trim(),
      faculty: facultyId,
    })

    if (existingCourse) {
      return res.status(409).json({
        message: 'Курс с таким названием уже существует для данного факультета',
      })
    }

    const newCourse = new Course({
      name: name.trim(),
      faculty: facultyId,
    })

    await newCourse.save()

    res.status(201).json({
      message: 'Курс создан успешно',
    })
  } catch (error) {
    res.status(500).json({
      message: error instanceof Error ? error.message : 'Неизвестная ошибка',
    })
  }
}

const updateCourse = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const { name, facultyId } = req.body

    if (!name || !name.trim() || !facultyId) {
      return res.status(400).json({
        message: 'Название курса и ID факультета обязательны',
      })
    }

    const course = await Course.findById(id)

    if (!course) {
      return res.status(404).json({
        message: 'Курс не найден',
      })
    }

    const faculty = await Faculty.findById(facultyId)

    if (!faculty) {
      return res.status(404).json({
        message: 'Факультет не найден',
      })
    }

    const existingCourse = await Course.findOne({
      name: name.trim(),
      faculty: facultyId,
      _id: { $ne: id },
    })

    if (existingCourse) {
      return res.status(409).json({
        message: 'Курс с таким названием уже существует для данного факультета',
      })
    }

    course.name = name.trim()
    course.faculty = facultyId

    await course.save()

    res.status(200).json({
      message: 'Курс обновлен успешно',
    })
  } catch (error) {
    res.status(500).json({
      message: error instanceof Error ? error.message : 'Неизвестная ошибка',
    })
  }
}

const deleteCourse = async (req: Request, res: Response) => {
  try {
    const { id } = req.params

    const course = await Course.findById(id)
    if (!course) {
      return res.status(404).json({
        message: 'Курс не найден',
      })
    }

    const groups = await Group.find({ course: id })
    const groupIds = groups.map((g) => g._id)

    await Schedule.deleteMany({ group: { $in: groupIds } })
    await Group.deleteMany({ course: id })
    await Course.findByIdAndDelete(id)

    res.status(200).json({
      message: 'Курс и связанные данные удалены успешно',
    })
  } catch (error) {
    res.status(500).json({
      message: error instanceof Error ? error.message : 'Неизвестная ошибка',
    })
  }
}

export { getCourses, createCourse, updateCourse, deleteCourse }
