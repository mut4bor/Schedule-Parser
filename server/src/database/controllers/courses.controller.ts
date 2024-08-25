import { Group } from '@/database/models/group.model'
import { getFilterParams } from '@/hooks/getFilterParams'
import { Request, Response } from 'express'

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

export { getCourses }
