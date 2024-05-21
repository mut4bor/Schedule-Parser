import { Group } from '../models/group.model.js'

const getGroupByName = async (req, res) => {
  try {
    const { name } = req.params
    const group = await Group.findOne({
      group: name,
    })
    res.status(200).json(group)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const getGroupNames = async (req, res) => {
  try {
    const groups = await Group.find({}, { group: 1, _id: 1 })
    res.status(200).json(groups)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export { getGroupByName, getGroupNames }
