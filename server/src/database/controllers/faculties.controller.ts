import { Group } from '@/database/models/group.model'
import { getFilterParams } from '@/hooks/getFilterParams'
import { Request, Response } from 'express'

const getFaculties = async (req: Request, res: Response) => {
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

    const result = records.reduce(
      (acc, { educationType, faculty }) => {
        if (!acc[educationType]) {
          acc[educationType] = new Set()
        }
        acc[educationType].add(faculty)
        return acc
      },
      {} as Record<string, Set<string>>,
    )

    const finalResult = Object.fromEntries(
      Object.entries(result)
        .map(([key, value]) => [key, Array.from(value)])
        .sort(([educationTypeA, facultiesA], [educationTypeB, facultiesB]) => facultiesB.length - facultiesA.length),
    )

    res.status(200).json(finalResult)
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message })
    } else {
      res.status(500).json({ message: 'An unknown error occurred' })
    }
  }
}

export { getFaculties }
