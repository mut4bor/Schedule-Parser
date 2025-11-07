import { Group } from '@/database/models/group.model.js'
import { getFilterParams } from '@/utils/getFilterParams.js'
import { Request, Response } from 'express'

const getGroupNames = async (req: Request, res: Response) => {
  try {
    const names = await Group.find({ ...getFilterParams(req) })
      .populate('educationType', 'name')
      .populate('faculty', 'name')
      .populate('course', 'name')
      .select('name educationType faculty course')
      .sort({ name: 1 })

    res.status(200).json(names)
  } catch (error) {
    res.status(500).json({
      message: error instanceof Error ? error.message : 'Неизвестная ошибка',
    })
  }
}

const getGroupNamesThatMatchWithReqParams = async (req: Request, res: Response) => {
  try {
    const { searchValue } = req.query
    if (!searchValue) {
      return res.status(400).json({ message: 'Значение поиска обязательно' })
    }

    const regex = new RegExp(searchValue as string, 'i')
    const names = await Group.find({ name: { $regex: regex } })
      .populate('educationType', 'name')
      .populate('faculty', 'name')
      .populate('course', 'name')
      .select('name educationType faculty course')
      .sort({ name: 1 })
      .limit(50)

    res.status(200).json(names)
  } catch (error) {
    res.status(500).json({
      message: error instanceof Error ? error.message : 'Неизвестная ошибка',
    })
  }
}

export { getGroupNames, getGroupNamesThatMatchWithReqParams }
