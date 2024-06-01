import { Group } from '../models/group.model.js'
import { getFilterParams } from './getFilterParams.js'

const getUniqueEducationTypes = async (req, res) => {
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

const getUniqueFaculties = async (req, res) => {
  try {
    const uniqueFaculties = await Group.distinct(
      'faculty',
      getFilterParams(req),
    )
    if (uniqueFaculties.length === 0) {
      res.status(404).json({
        message: 'No unique courses found for the specified criteria.',
      })
      return
    }
    res.status(200).json(uniqueFaculties)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const getUniqueCourses = async (req, res) => {
  try {
    const uniqueCourseNumbers = await Group.distinct(
      'course',
      getFilterParams(req),
    )
    res.status(200).json(uniqueCourseNumbers)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
export { getUniqueEducationTypes, getUniqueFaculties, getUniqueCourses }
