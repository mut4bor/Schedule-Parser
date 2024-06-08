import { Group } from '../models/group.model.js'
import { getFilterParams } from './getFilterParams.js'

const getGroupNames = async (req, res) => {
  try {
    const names = await Group.find(getFilterParams(req), {
      dates: 0,
    })

    const sortedNames = names.sort((nameA, nameB) => nameA.index - nameB.index)

    res.status(200).json(sortedNames)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const getGroupNamesThatMatchWithReqParams = async (req, res) => {
  try {
    const { searchValue } = req.query
    if (!searchValue) {
      return res.status(400).json({ message: 'Search value query parameter is required' })
    }

    const regex = new RegExp(searchValue, 'i')
    const names = await Group.find(
      { group: { $regex: regex } },
      {
        group: 1,
        _id: 1,
        index: 1,
      },
    )

    const sortedNames = names.sort((nameA, nameB) => nameA.index - nameB.index)

    res.status(200).json(sortedNames)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export { getGroupNames, getGroupNamesThatMatchWithReqParams }
