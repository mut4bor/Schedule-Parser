import { Group } from '@/database/models/group.model.js'
import { getFilterParams } from '@/utils/getFilterParams.js'
import { Request, Response } from 'express'

const getEducationTypes = async (req: Request, res: Response) => {
  try {
    const educationTypes = await Group.distinct('educationType', getFilterParams(req))
    res.status(200).json(educationTypes)
  } catch (error) {
    res.status(500).json({
      message: error instanceof Error ? error.message : 'Неизвестная ошибка',
    })
  }
}

const createEducationType = async (req: Request, res: Response) => {
  try {
    const { educationType } = req.body

    if (!educationType) {
      return res.status(400).json({
        message: 'Тип образования обязателен',
      })
    }

    const newGroup = new Group({
      educationType,
      faculty: null,
      course: null,
      group: null,
      dates: {},
    })

    await newGroup.save()
    res.status(201).json({
      message: 'Тип образования создан успешно',
      group: newGroup,
    })
  } catch (error) {
    res.status(500).json({
      message: error instanceof Error ? error.message : 'Неизвестная ошибка',
    })
  }
}

const updateEducationType = async (req: Request, res: Response) => {
  try {
    const { oldEducationType, newEducationType } = req.body

    if (!oldEducationType || !newEducationType) {
      return res.status(400).json({
        message: 'Старый тип образования и новый тип образования обязателы',
      })
    }

    const result = await Group.updateMany({ educationType: oldEducationType }, { educationType: newEducationType })

    res.status(200).json({
      message: 'Тип образования обновлен успешно',
      modifiedCount: result.modifiedCount,
    })
  } catch (error) {
    res.status(500).json({
      message: error instanceof Error ? error.message : 'Неизвестная ошибка',
    })
  }
}

const deleteEducationType = async (req: Request, res: Response) => {
  try {
    const { educationType } = req.params

    if (!educationType) {
      return res.status(400).json({ message: 'Тип образования обязателен' })
    }

    const result = await Group.deleteMany({ educationType })

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Тип образования не найден' })
    }

    res.status(200).json({
      message: 'Тип образования удален успешно',
      deletedCount: result.deletedCount,
    })
  } catch (error) {
    res.status(500).json({
      message: error instanceof Error ? error.message : 'Неизвестная ошибка',
    })
  }
}

const getGroupsByEducationType = async (req: Request, res: Response) => {
  try {
    const { educationType } = req.params

    if (!educationType) {
      return res.status(400).json({ message: 'Тип образования обязателен' })
    }

    const groups = await Group.find({ educationType }, { dates: 0 })
    res.status(200).json(groups)
  } catch (error) {
    res.status(500).json({
      message: error instanceof Error ? error.message : 'Неизвестная ошибка',
    })
  }
}

export { getEducationTypes, createEducationType, updateEducationType, deleteEducationType, getGroupsByEducationType }
