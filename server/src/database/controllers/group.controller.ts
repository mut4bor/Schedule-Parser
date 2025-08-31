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

    const weeks = Array.from(group.dates.keys())

    res.status(200).json(weeks)
  } catch (error) {
    res.status(500).json({
      message: error instanceof Error ? error.message : 'An unknown error occurred',
    })
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

    const weekData = group.dates?.get(week)
    if (!weekData) {
      return res.status(404).json({ message: 'Week not found' })
    }

    res.status(200).json(weekData)
  } catch (error) {
    res.status(500).json({
      message: error instanceof Error ? error.message : 'An unknown error occurred',
    })
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

const addWeekNameToGroup = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const { weekName } = req.body

    if (!id || !weekName) {
      return res.status(400).json({
        message: 'ID and weekName are required',
      })
    }

    const group = await Group.findById(id)
    if (!group) {
      return res.status(404).json({ message: 'Group not found' })
    }

    group.dates.set(weekName, {
      day: {
        time: 'subject',
      },
    })

    await group.save()

    res.status(200).json({
      message: 'Week name added successfully',
    })
  } catch (error) {
    res.status(500).json({
      message: error instanceof Error ? error.message : 'An unknown error occurred',
    })
  }
}

const updateWeekNameInGroup = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const { oldWeekName, newWeekName } = req.body

    if (!id || !oldWeekName || !newWeekName) {
      return res.status(400).json({
        message: 'ID, oldWeekName, and newWeekName are required',
      })
    }

    const updateResult = await Group.updateOne(
      { _id: id, [`dates.${oldWeekName}`]: { $exists: true } },
      { $rename: { [`dates.${oldWeekName}`]: `dates.${newWeekName}` } },
    )

    if (updateResult.matchedCount === 0) {
      const groupExists = await Group.exists({ _id: id })
      if (!groupExists) {
        return res.status(404).json({ message: 'Group not found' })
      }
      return res.status(404).json({ message: 'Old week name not found' })
    }

    res.status(200).json({
      message: 'Week name updated successfully',
    })
  } catch (error) {
    res.status(500).json({
      message: error instanceof Error ? error.message : 'An unknown error occurred',
    })
  }
}

const deleteWeekNameFromGroup = async (req: Request, res: Response) => {
  try {
    const { id, weekName } = req.params

    if (!id || !weekName) {
      return res.status(400).json({ message: 'ID and weekName are required' })
    }

    const group = await Group.findById(id)
    if (!group) {
      return res.status(404).json({ message: 'Group not found' })
    }

    if (!group.dates.has(weekName)) {
      return res.status(404).json({ message: 'Week name not found' })
    }

    group.dates.delete(weekName)
    await group.save()

    res.status(200).json({ message: 'Week name deleted successfully' })
  } catch (error) {
    res.status(500).json({
      message: error instanceof Error ? error.message : 'An unknown error occurred',
    })
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
  addWeekNameToGroup,
  updateWeekNameInGroup,
  deleteWeekNameFromGroup,
  updateGroupField,
}
