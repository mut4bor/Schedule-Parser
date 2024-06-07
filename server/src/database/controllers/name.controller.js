import { Group } from '../models/group.model.js'
import { getFilterParams } from './getFilterParams.js'

const getGroupNames = async (req, res) => {
  try {
    const names = await Group.find(getFilterParams(req), {
      dates: 0,
    })
    res.status(200).json(names)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export { getGroupNames }
