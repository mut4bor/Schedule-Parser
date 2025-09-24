import { Group } from '@/database/models/group.model.js'
import { getFilterParams } from '@/utils/getFilterParams.js'
import { Request, Response } from 'express'
import { datesMap } from './helpers.js'

const getFaculties = async (req: Request, res: Response) => {
  try {
    const records = await Group.find(getFilterParams(req), {
      educationType: 1,
      faculty: 1,
      _id: 0,
    })

    if (records.length === 0) {
      res.status(404).json({
        message: 'No unique courses found for the specified criteria.',
      })
      return
    }

    const result = records.reduce(
      (acc, { educationType, faculty }) => {
        if (!acc[educationType]) {
          acc[educationType] = new Set()
        }
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
    if (error instanceof Error) {
      res.status(500).json({ message: error.message })
    } else {
      res.status(500).json({ message: 'An unknown error occurred' })
    }
  }
}

const getAllFaculties = async (req: Request, res: Response) => {
  try {
    const faculties = await Group.distinct('faculty', getFilterParams(req))
    res.status(200).json(faculties)
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message })
    } else {
      res.status(500).json({ message: 'An unknown error occurred' })
    }
  }
}

const createFaculty = async (req: Request, res: Response) => {
  try {
    const { educationType, faculty } = req.body

    if (!educationType || !faculty) {
      return res.status(400).json({
        message: 'educationType, faculty, course, and group are required',
      })
    }

    const newGroup = new Group({
      educationType,
      faculty,
      course: 'course',
      group: 'group',
      dates: datesMap,
    })

    await newGroup.save()
    res.status(201).json({
      message: 'Faculty created successfully',
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

const updateFaculty = async (req: Request, res: Response) => {
  try {
    const { educationType, oldFaculty, newFaculty } = req.body

    if (!educationType || !oldFaculty || !newFaculty) {
      return res.status(400).json({
        message: 'educationType, oldFaculty и newFaculty обязательны',
      })
    }

    const result = await Group.updateMany({ educationType, faculty: oldFaculty }, { faculty: newFaculty })

    res.status(200).json({
      message: 'Faculty updated successfully',
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

const deleteFaculty = async (req: Request, res: Response) => {
  try {
    const { educationType, faculty } = req.params

    if (!educationType || !faculty) {
      return res.status(400).json({ message: 'educationType и faculty обязательны' })
    }

    const result = await Group.deleteMany({ educationType, faculty })

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Faculty not found' })
    }

    res.status(200).json({
      message: 'Faculty deleted successfully',
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

const getGroupsByFaculty = async (req: Request, res: Response) => {
  try {
    const { faculty } = req.params

    if (!faculty) {
      return res.status(400).json({ message: 'Faculty is required' })
    }

    const groups = await Group.find({ faculty }, { dates: 0 })
    res.status(200).json(groups)
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message })
    } else {
      res.status(500).json({ message: 'An unknown error occurred' })
    }
  }
}

export { getFaculties, getAllFaculties, createFaculty, updateFaculty, deleteFaculty, getGroupsByFaculty }
