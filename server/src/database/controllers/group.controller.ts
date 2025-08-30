import { Group } from '@/database/models/group.model.js'
import { getFilterParams } from '@/hooks/getFilterParams.js'
import { Request, Response } from 'express'

const getAllGroups = async (req: Request, res: Response) => {
  try {
    const groups = await Group.find(getFilterParams(req))
    res.status(200).json(groups)
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message })
    } else {
      res.status(500).json({ message: 'An unknown error occurred' })
    }
  }
}

const getGroupById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    if (!id) {
      return res.status(400).json({ message: 'ID is required' })
    }
    const group = await Group.findById(id, {
      dates: 0,
    })

    if (!group) {
      return res.status(404).json({ message: 'Group not found' })
    }

    res.status(200).json(group)
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message })
    } else {
      res.status(500).json({ message: 'An unknown error occurred' })
    }
  }
}

const getWeeksByID = async (req: Request, res: Response) => {
  try {
    const { id } = req.params

    if (!id) {
      return res.status(400).json({ message: 'ID is required' })
    }

    const group = await Group.findById(id)

    if (!group) {
      return res.status(404).json({ message: 'Group not found' })
    }

    if (!group.dates) {
      return res.status(400).json({ message: 'Invalid group dates' })
    }

    const weeks = Object.keys(group.dates)

    res.status(200).json(weeks)
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message })
    } else {
      res.status(500).json({ message: 'An unknown error occurred' })
    }
  }
}

const getWeekScheduleByID = async (req: Request, res: Response) => {
  try {
    const { id, week } = req.params

    if (!id || !week) {
      return res.status(400).json({ message: 'ID and week are required' })
    }

    const group = await Group.findById(id)

    if (!group) {
      return res.status(404).json({ message: 'Group not found' })
    }

    if (!group.dates || typeof group.dates !== 'object') {
      return res.status(400).json({ message: 'Invalid group dates' })
    }

    const weekData = group.dates[week]
    if (!weekData) {
      return res.status(404).json({ message: 'Week not found' })
    }

    res.status(200).json(weekData)
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message })
    } else {
      res.status(500).json({ message: 'An unknown error occurred' })
    }
  }
}

const createGroup = async (req: Request, res: Response) => {
  try {
    const group = new Group(req.body)
    await group.save()
    res.status(201).json(group)
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message })
    } else {
      res.status(500).json({ message: 'An unknown error occurred' })
    }
  }
}

const updateGroupById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const group = await Group.findByIdAndUpdate(id, req.body)
    if (!group) {
      return res.status(404).json({ message: 'Group not found' })
    }
    const updatedGroup = await Group.findById(id)
    res.status(200).json(updatedGroup)
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message })
    } else {
      res.status(500).json({ message: 'An unknown error occurred' })
    }
  }
}

const deleteGroupById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const group = await Group.findByIdAndDelete(id)
    if (!group) {
      return res.status(404).json({ message: 'Group not found' })
    }
    res.status(200).json({ message: 'Group deleted successfully' })
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message })
    } else {
      res.status(500).json({ message: 'An unknown error occurred' })
    }
  }
}

const deleteAllGroups = async (req: Request, res: Response) => {
  try {
    await Group.deleteMany({})
    res.status(200).json({ message: 'All groups deleted successfully' })
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message })
    } else {
      res.status(500).json({ message: 'An unknown error occurred' })
    }
  }
}

// Новые методы для управления расписанием
const addWeekToGroup = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const { week, weekData } = req.body

    if (!id || !week || !weekData) {
      return res.status(400).json({
        message: 'ID, week, and weekData are required',
      })
    }

    const group = await Group.findById(id)
    if (!group) {
      return res.status(404).json({ message: 'Group not found' })
    }

    if (!group.dates) {
      group.dates = {}
    }

    group.dates[week] = weekData
    await group.save()

    res.status(200).json({
      message: 'Week added successfully',
      week: group.dates[week],
    })
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message })
    } else {
      res.status(500).json({ message: 'An unknown error occurred' })
    }
  }
}

const updateWeekInGroup = async (req: Request, res: Response) => {
  try {
    const { id, week } = req.params
    const { weekData } = req.body

    if (!id || !week || !weekData) {
      return res.status(400).json({
        message: 'ID, week, and weekData are required',
      })
    }

    const group = await Group.findById(id)
    if (!group) {
      return res.status(404).json({ message: 'Group not found' })
    }

    if (!group.dates || !group.dates[week]) {
      return res.status(404).json({ message: 'Week not found' })
    }

    group.dates[week] = weekData
    await group.save()

    res.status(200).json({
      message: 'Week updated successfully',
      week: group.dates[week],
    })
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message })
    } else {
      res.status(500).json({ message: 'An unknown error occurred' })
    }
  }
}

const deleteWeekFromGroup = async (req: Request, res: Response) => {
  try {
    const { id, week } = req.params

    if (!id || !week) {
      return res.status(400).json({ message: 'ID and week are required' })
    }

    const group = await Group.findById(id)
    if (!group) {
      return res.status(404).json({ message: 'Group not found' })
    }

    if (!group.dates || !group.dates[week]) {
      return res.status(404).json({ message: 'Week not found' })
    }

    delete group.dates[week]
    await group.save()

    res.status(200).json({ message: 'Week deleted successfully' })
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message })
    } else {
      res.status(500).json({ message: 'An unknown error occurred' })
    }
  }
}

const updateGroupField = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const { field, value } = req.body

    if (!id || !field || value === undefined) {
      return res.status(400).json({
        message: 'ID, field, and value are required',
      })
    }

    const allowedFields = ['educationType', 'faculty', 'course', 'group', 'index']
    if (!allowedFields.includes(field)) {
      return res.status(400).json({
        message: 'Invalid field. Allowed fields: ' + allowedFields.join(', '),
      })
    }

    const updateData = { [field]: value }
    const group = await Group.findByIdAndUpdate(id, updateData, { new: true })

    if (!group) {
      return res.status(404).json({ message: 'Group not found' })
    }

    res.status(200).json({
      message: `${field} updated successfully`,
      group,
    })
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message })
    } else {
      res.status(500).json({ message: 'An unknown error occurred' })
    }
  }
}

export {
  getAllGroups,
  getGroupById,
  getWeeksByID,
  getWeekScheduleByID,
  createGroup,
  updateGroupById,
  deleteGroupById,
  deleteAllGroups,
  addWeekToGroup,
  updateWeekInGroup,
  deleteWeekFromGroup,
  updateGroupField,
}
