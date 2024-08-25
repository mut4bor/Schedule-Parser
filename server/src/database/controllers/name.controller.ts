import { Group } from '@/database/models/group.model'
import { getFilterParams } from '@/hooks/getFilterParams'
import { Request, Response } from 'express'

const getGroupNames = async (req: Request, res: Response) => {
  try {
    const names = await Group.find(getFilterParams(req), {
      dates: 0,
    })

    const sortedNames = names.sort((nameA, nameB) => nameA.index - nameB.index)

    res.status(200).json(sortedNames)
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message })
    } else {
      res.status(500).json({ message: 'An unknown error occurred' })
    }
  }
}

const getGroupNamesThatMatchWithReqParams = async (req: Request, res: Response) => {
  try {
    const { searchValue } = req.query
    if (!searchValue) {
      return res.status(400).json({ message: 'Search value query parameter is required' })
    }

    const regex = new RegExp(searchValue as string, 'i')
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
    if (error instanceof Error) {
      res.status(500).json({ message: error.message })
    } else {
      res.status(500).json({ message: 'An unknown error occurred' })
    }
  }
}

export { getGroupNames, getGroupNamesThatMatchWithReqParams }
