import { Group } from '@/database/models/group.model.js'
import { Schedule } from '@/database/models/schedule.model.js'
import { Faculty } from '@/database/models/faculty.model.js'
import { EducationType } from '@/database/models/educationType.model.js'
import { Course } from '@/database/models/course.model.js'
import { Request, Response } from 'express'

const getAllGroups = async (req: Request, res: Response) => {
  try {
    const { educationType, faculty, course } = req.query

    const filter: any = {}
    if (educationType) filter.educationType = educationType
    if (faculty) filter.faculty = faculty
    if (course) filter.course = course

    const groups = await Group.find(filter)
      .populate('educationType', 'name')
      .populate('faculty', 'name')
      .populate('course', 'name')
      .sort({ name: 1 })

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

    const group = await Group.findById(id)
      .populate('educationType', 'name')
      .populate('faculty', 'name')
      .populate('course', 'name')

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

const createGroup = async (req: Request, res: Response) => {
  try {
    const { name, educationType, faculty, course, capacity, description } = req.body

    if (!name || !educationType || !faculty || !course || !capacity) {
      return res.status(400).json({
        message: 'Название, тип образования, факультет, курс и количество человек обязательны',
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
      capacity,
      description,
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
    const { name, educationType, faculty, course, capacity, description } = req.body

    const group = await Group.findById(id)

    if (!group) {
      return res.status(404).json({ message: 'Группа не найдена' })
    }

    if (educationType) {
      const eduType = await EducationType.findById(educationType)
      if (!eduType) {
        return res.status(404).json({
          message: 'Тип образования не найден',
        })
      }
      group.educationType = educationType
    }

    if (faculty) {
      const facultyDoc = await Faculty.findById(faculty)
      if (!facultyDoc) {
        return res.status(404).json({
          message: 'Факультет не найден',
        })
      }
      group.faculty = faculty
    }

    if (course) {
      const courseDoc = await Course.findById(course)
      if (!courseDoc) {
        return res.status(404).json({
          message: 'Курс не найден',
        })
      }
      group.course = course
    }

    if (name) {
      group.name = name.trim()
    }

    if (capacity) {
      group.capacity = capacity
    }

    if (description) {
      group.description = description
    }

    // Проверяем уникальность с новыми значениями
    const existingGroup = await Group.findOne({
      name: group.name,
      faculty: group.faculty,
      course: group.course,
      _id: { $ne: id },
    })

    if (existingGroup) {
      return res.status(409).json({
        message: 'Группа с такими параметрами уже существует',
      })
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

    await Schedule.deleteMany({ group: id })
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

export { getAllGroups, getGroupById, createGroup, updateGroupById, deleteGroupById }
