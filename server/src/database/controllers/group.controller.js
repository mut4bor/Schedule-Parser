import { Group } from '../models/group.model.js'
import { getFilterParams } from './getFilterParams.js'

const getAllGroups = async (req, res) => {
  try {
    const groups = await Group.find(getFilterParams(req))
    res.status(200).json(groups)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const getGroupById = async (req, res) => {
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
    res.status(500).json({ message: error.message })
  }
}

const getWeeksByID = async (req, res) => {
  try {
    const { id } = req.params

    if (!id) {
      return res.status(400).json({ message: 'ID is required' })
    }

    const group = await Group.findById(id)

    if (!group) {
      return res.status(404).json({ message: 'Group not found' })
    }

    if (!group.dates || typeof group.dates !== 'object') {
      return res.status(400).json({ message: 'Invalid group dates' })
    }

    const weeks = Object.keys(group.dates)

    res.status(200).json(weeks)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const getWeekDaysByID = async (req, res) => {
  try {
    const { id, week } = req.params

    if (!id) {
      return res.status(400).json({ message: 'ID is required' })
    }

    if (!week) {
      return res.status(400).json({ message: 'Week is required' })
    }

    const group = await Group.findById(id)

    if (!group) {
      return res.status(404).json({ message: 'Group not found' })
    }

    const days = Object.keys(group.dates[week])

    if (!days) {
      return res.status(404).json({ message: 'Days not found' })
    }

    res.status(200).json(days)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const getScheduleByID = async (req, res) => {
  try {
    const { id, week, dayIndex } = req.params

    if (!id) {
      return res.status(400).json({ message: 'ID is required' })
    }

    if (!week) {
      return res.status(400).json({ message: 'Week is required' })
    }

    if (!dayIndex) {
      return res.status(400).json({ message: 'Day index is required' })
    }

    const group = await Group.findById(id)

    if (!group) {
      return res.status(404).json({ message: 'Group not found' })
    }

    const schedule = group.dates[week][Object.keys(group.dates[week])[dayIndex]]

    if (!schedule) {
      return res.status(404).json({ message: 'Schedule not found' })
    }

    res.status(200).json(schedule)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const createGroup = async (req, res) => {
  try {
    const group = new Group(req.body)
    await group.save()
    res.status(201).json(group)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const updateGroupById = async (req, res) => {
  try {
    const { id } = req.params
    const group = await Group.findByIdAndUpdate(id, req.body)
    if (!group) {
      return res.status(404).json({ message: 'Group not found' })
    }
    const updatedGroup = await Group.findById(id)
    res.status(200).json(updatedGroup)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const deleteGroupById = async (req, res) => {
  try {
    const { id } = req.params
    const group = await Group.findByIdAndDelete(id, req.body)
    if (!group) {
      return res.status(404).json({ message: 'Group not found' })
    }
    res.status(200).json({ message: 'Group deleted successfully' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const deleteAllGroups = async (req, res) => {
  try {
    await Group.deleteMany({})
    res.status(200).json({ message: 'All groups deleted successfully' })
  } catch (error) {
    if (error.response) {
      console.error('Error:', error.response.status, error.response.data)
    } else if (error.request) {
      console.error('No response received:', error.request)
    } else {
      console.error('Error:', error.message)
    }
  }
}

export {
  getAllGroups,
  getGroupById,
  getWeeksByID,
  getWeekDaysByID,
  getScheduleByID,
  createGroup,
  updateGroupById,
  deleteGroupById,
  deleteAllGroups,
}
