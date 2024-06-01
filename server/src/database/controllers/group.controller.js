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
    const group = await Group.findById(id)
    res.status(200).json(group)
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
  createGroup,
  updateGroupById,
  deleteGroupById,
  deleteAllGroups,
}
