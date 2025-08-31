import { Group } from '@/database/models/group.model.js'
import { getFilterParams } from '@/hooks/getFilterParams.js'
import { Request, Response } from 'express'

const getEducationTypes = async (req: Request, res: Response) => {
  try {
    const educationTypes = await Group.distinct('educationType', getFilterParams(req))
    res.status(200).json(educationTypes)
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message })
    } else {
      res.status(500).json({ message: 'An unknown error occurred' })
    }
  }
}

const createEducationType = async (req: Request, res: Response) => {
  try {
    const { educationType } = req.body

    if (!educationType) {
      return res.status(400).json({
        message: 'educationType и faculty обязательны',
      })
    }

    const newGroup = new Group({
      educationType,
      faculty: 'Placeholder',
      course: 'Placeholder',
      group: 'Placeholder',
      dates: {
        Placeholder: 'Placeholder',
      },
    })

    await newGroup.save()
    res.status(201).json({
      message: 'Education type created successfully',
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

const updateEducationType = async (req: Request, res: Response) => {
  try {
    const { oldEducationType, newEducationType } = req.body

    if (!oldEducationType || !newEducationType) {
      return res.status(400).json({
        message: 'oldEducationType and newEducationType are required',
      })
    }

    const result = await Group.updateMany({ educationType: oldEducationType }, { educationType: newEducationType })

    res.status(200).json({
      message: 'Education type updated successfully',
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

const deleteEducationType = async (req: Request, res: Response) => {
  try {
    const { educationType } = req.params

    if (!educationType) {
      return res.status(400).json({ message: 'Education type is required' })
    }

    const result = await Group.deleteMany({ educationType })

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Education type not found' })
    }

    res.status(200).json({
      message: 'Education type deleted successfully',
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

const getGroupsByEducationType = async (req: Request, res: Response) => {
  try {
    const { educationType } = req.params

    if (!educationType) {
      return res.status(400).json({ message: 'Education type is required' })
    }

    const groups = await Group.find({ educationType }, { dates: 0 })
    res.status(200).json(groups)
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message })
    } else {
      res.status(500).json({ message: 'An unknown error occurred' })
    }
  }
}

export { getEducationTypes, createEducationType, updateEducationType, deleteEducationType, getGroupsByEducationType }
