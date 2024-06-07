import { Group } from '../models/group.model.js'

const getEducationTypes = async (req, res) => {
  try {
    const uniqueEducationTypes = await Group.distinct('educationType')
    if (uniqueEducationTypes.length === 0) {
      res.status(404).json({
        message: 'No unique courses found for the specified criteria.',
      })
      return
    }
    res.status(200).json(uniqueEducationTypes)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export { getEducationTypes }
