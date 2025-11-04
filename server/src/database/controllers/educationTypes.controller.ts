import { EducationType } from '@/database/models/educationType.model.js'
import { Faculty } from '@/database/models/faculty.model.js'
import { Group } from '@/database/models/group.model.js'
import { Schedule } from '@/database/models/schedule.model.js'
import { Request, Response } from 'express'

const getEducationTypes = async (req: Request, res: Response) => {
  try {
    const educationTypes = await EducationType.find().sort({ name: 1 })
    res.status(200).json(educationTypes)
  } catch (error) {
    res.status(500).json({
      message: error instanceof Error ? error.message : 'Неизвестная ошибка',
    })
  }
}

const createEducationType = async (req: Request, res: Response) => {
  try {
    const { name } = req.body

    if (!name || !name.trim()) {
      return res.status(400).json({
        message: 'Название типа образования обязательно',
      })
    }

    const existingType = await EducationType.findOne({
      name: name.trim(),
    })

    if (existingType) {
      return res.status(409).json({
        message: 'Тип образования с таким названием уже существует',
      })
    }

    const newEducationType = new EducationType({
      name: name.trim(),
    })

    await newEducationType.save()
    res.status(201).json({
      message: 'Тип образования создан успешно',
    })
  } catch (error) {
    res.status(500).json({
      message: error instanceof Error ? error.message : 'Неизвестная ошибка',
    })
  }
}

const updateEducationType = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const { name } = req.body

    if (!name || !name.trim()) {
      return res.status(400).json({
        message: 'Название типа образования обязательно',
      })
    }

    const existingType = await EducationType.findOne({
      name: name.trim(),
      _id: { $ne: id },
    })
    if (existingType) {
      return res.status(409).json({
        message: 'Тип образования с таким названием уже существует',
      })
    }

    const updatedEducationType = await EducationType.findByIdAndUpdate(
      id,
      { name: name.trim() },
      { new: true, runValidators: true },
    )

    if (!updatedEducationType) {
      return res.status(404).json({
        message: 'Тип образования не найден',
      })
    }

    res.status(200).json({
      message: 'Тип образования обновлен успешно',
      educationType: updatedEducationType,
    })
  } catch (error) {
    res.status(500).json({
      message: error instanceof Error ? error.message : 'Неизвестная ошибка',
    })
  }
}

const deleteEducationType = async (req: Request, res: Response) => {
  try {
    const { id } = req.params

    const educationType = await EducationType.findById(id)
    if (!educationType) {
      return res.status(404).json({
        message: 'Тип образования не найден',
      })
    }

    const groups = await Group.find({ educationType: id })
    const groupIds = groups.map((g) => g._id)

    await Schedule.deleteMany({ group: { $in: groupIds } })
    await Group.deleteMany({ educationType: id })
    await Faculty.deleteMany({ educationType: id })
    await EducationType.findByIdAndDelete(id)

    res.status(200).json({
      message: 'Тип образования и связанные данные удалены успешно',
    })
  } catch (error) {
    res.status(500).json({
      message: error instanceof Error ? error.message : 'Неизвестная ошибка',
    })
  }
}

export { getEducationTypes, createEducationType, updateEducationType, deleteEducationType }
