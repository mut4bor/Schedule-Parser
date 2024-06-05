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
    const records = await Group.find(getFilterParams(req), {
      educationType: 1,
      faculty: 1,
      _id: 0,
    })

    if (records.length === 0) {
      res.status(404).json({
        message: 'No unique courses found for the specified criteria.',
      })
      return
    }

    const result = records.reduce((acc, { educationType, faculty }) => {
      if (!acc[educationType]) {
        acc[educationType] = new Set()
      }
      acc[educationType].add(faculty)
      return acc
    }, {})

    const finalResult = Object.fromEntries(
      Object.entries(result)
        .map(([key, value]) => [key, Array.from(value)])
        .sort(
          ([educationTypeA, facultiesA], [educationTypeB, facultiesB]) =>
            facultiesB.length - facultiesA.length,
        ),
    )

    res.status(200).json(finalResult)
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
