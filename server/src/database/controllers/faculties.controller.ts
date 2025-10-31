import { Group } from '@/database/models/group.model.js'
import { getFilterParams } from '@/utils/getFilterParams.js'
import { Request, Response } from 'express'

const getFaculties = async (req: Request, res: Response) => {
  try {
    const records = await Group.find(getFilterParams(req), {
      educationType: 1,
      faculty: 1,
      _id: 0,
    })

    if (records.length === 0) {
      res.status(404).json({
        message: 'Не найдено уникальных факультетов для указанных критериев.',
      })
      return
    }

    const result = records.reduce(
      (acc, { educationType, faculty }) => {
        if (!educationType) return acc
        if (!acc[educationType]) {
          acc[educationType] = new Set()
        }
        if (!faculty) return acc
        acc[educationType].add(faculty)
        return acc
      },
      {} as Record<string, Set<string>>,
    )

    const finalResult = Object.fromEntries(
      Object.entries(result)
        .map(([key, value]) => [key, Array.from(value)])
        .sort(([, facultiesA], [, facultiesB]) => facultiesB.length - facultiesA.length),
    )

    res.status(200).json(finalResult)
  } catch (error) {
    res.status(500).json({
      message: error instanceof Error ? error.message : 'Неизвестная ошибка',
    })
  }
}

const getAllFaculties = async (req: Request, res: Response) => {
  try {
    const faculties = await Group.distinct('faculty', getFilterParams(req))
    res.status(200).json(faculties)
  } catch (error) {
    res.status(500).json({
      message: error instanceof Error ? error.message : 'Неизвестная ошибка',
    })
  }
}

const createFaculty = async (req: Request, res: Response) => {
  try {
    const { educationType, faculty } = req.body

    if (!educationType || !faculty) {
      return res.status(400).json({
        message: 'Тип образования, факультет и курс обязательны',
      })
    }

    const newGroup = new Group({
      educationType,
      faculty,
      course: null,
      group: null,
      dates: {},
    })

    await newGroup.save()
    res.status(201).json({
      message: 'Факультет создан успешно',
      group: newGroup,
    })
  } catch (error) {
    res.status(500).json({
      message: error instanceof Error ? error.message : 'Неизвестная ошибка',
    })
  }
}

const updateFaculty = async (req: Request, res: Response) => {
  try {
    const { educationType, oldFaculty, newFaculty } = req.body

    if (!educationType || !oldFaculty || !newFaculty) {
      return res.status(400).json({
        message: 'Тип образования, старый факультет и новый факультет обязательны',
      })
    }

    const result = await Group.updateMany({ educationType, faculty: oldFaculty }, { faculty: newFaculty })

    res.status(200).json({
      message: 'Факультет обновлен успешно',
      modifiedCount: result.modifiedCount,
    })
  } catch (error) {
    res.status(500).json({
      message: error instanceof Error ? error.message : 'Неизвестная ошибка',
    })
  }
}

const deleteFaculty = async (req: Request, res: Response) => {
  try {
    const { educationType, faculty } = req.params

    if (!educationType || !faculty) {
      return res.status(400).json({ message: 'Тип образования и факультет обязательны' })
    }

    const result = await Group.deleteMany({ educationType, faculty })

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Факультет не найден' })
    }

    res.status(200).json({
      message: 'Факультет удален успешно',
      deletedCount: result.deletedCount,
    })
  } catch (error) {
    res.status(500).json({
      message: error instanceof Error ? error.message : 'Неизвестная ошибка',
    })
  }
}

const getGroupsByFaculty = async (req: Request, res: Response) => {
  try {
    const { faculty } = req.params

    if (!faculty) {
      return res.status(400).json({ message: 'Факультет обязателен' })
    }

    const groups = await Group.find({ faculty }, { dates: 0 })
    res.status(200).json(groups)
  } catch (error) {
    res.status(500).json({
      message: error instanceof Error ? error.message : 'Неизвестная ошибка',
    })
  }
}

export { getFaculties, getAllFaculties, createFaculty, updateFaculty, deleteFaculty, getGroupsByFaculty }
