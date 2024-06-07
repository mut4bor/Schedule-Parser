import { Group } from '../models/group.model.js'
import { getFilterParams } from './getFilterParams.js'

const getCourses = async (req, res) => {
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
export { getCourses }
