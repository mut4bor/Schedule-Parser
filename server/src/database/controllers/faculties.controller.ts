import { EducationType } from '@/database/models/educationType.model.js'
import { Faculty } from '@/database/models/faculty.model.js'
import { Group } from '@/database/models/group.model.js'
import { Schedule } from '@/database/models/schedule.model.js'
import { Request, Response } from 'express'

const getFaculties = async (req: Request, res: Response) => {
  try {
    const { educationType } = req.query

    const filter = educationType ? { educationType } : {}

    const faculties = await Faculty.find(filter).populate('educationType', 'name').sort({ name: 1 })

    res.status(200).json(faculties)
  } catch (error) {
    res.status(500).json({
      message: error instanceof Error ? error.message : 'Неизвестная ошибка',
    })
  }
}

const createFaculty = async (req: Request, res: Response) => {
  try {
    const { name, educationType } = req.body

    if (!name || !name.trim() || !educationType) {
      return res.status(400).json({
        message: 'Название факультета и тип образования обязательны',
      })
    }

    const eduTypeExists = await EducationType.findById(educationType)

    if (!eduTypeExists) {
      return res.status(404).json({
        message: 'Тип образования не найден',
      })
    }

    const existingFaculty = await Faculty.findOne({
      name: name.trim(),
      educationType,
    })

    if (existingFaculty) {
      return res.status(409).json({
        message: 'Факультет с таким названием уже существует для данного типа образования',
      })
    }

    const newFaculty = new Faculty({
      name: name.trim(),
      educationType,
    })

    await newFaculty.save()

    res.status(201).json({
      message: 'Факультет создан успешно',
    })
  } catch (error) {
    res.status(500).json({
      message: error instanceof Error ? error.message : 'Неизвестная ошибка',
    })
  }
}

const updateFaculty = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const { name } = req.body

    if (!name || !name.trim()) {
      return res.status(400).json({
        message: 'Название факультета обязательно',
      })
    }

    const faculty = await Faculty.findById(id)

    if (!faculty) {
      return res.status(404).json({
        message: 'Факультет не найден',
      })
    }

    const existingFaculty = await Faculty.findOne({
      name: name.trim(),
      educationType: faculty.educationType,
      _id: { $ne: id },
    })

    if (existingFaculty) {
      return res.status(409).json({
        message: 'Факультет с таким названием уже существует',
      })
    }

    faculty.name = name.trim()

    await faculty.save()

    res.status(200).json({
      message: 'Факультет обновлен успешно',
    })
  } catch (error) {
    res.status(500).json({
      message: error instanceof Error ? error.message : 'Неизвестная ошибка',
    })
  }
}

const deleteFaculty = async (req: Request, res: Response) => {
  try {
    const { id } = req.params

    const faculty = await Faculty.findById(id)
    if (!faculty) {
      return res.status(404).json({
        message: 'Факультет не найден',
      })
    }

    const groups = await Group.find({ faculty: id })
    const groupIds = groups.map((g) => g._id)

    await Schedule.deleteMany({
      group: { $in: groupIds },
    })
    await Group.deleteMany({ faculty: id })
    await Faculty.findByIdAndDelete(id)

    res.status(200).json({
      message: 'Факультет и связанные данные удалены успешно',
    })
  } catch (error) {
    res.status(500).json({
      message: error instanceof Error ? error.message : 'Неизвестная ошибка',
    })
  }
}

export { getFaculties, createFaculty, updateFaculty, deleteFaculty }
