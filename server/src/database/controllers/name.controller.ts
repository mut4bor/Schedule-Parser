import { Group } from '@/database/models/group.model.js'
import { getFilterParams } from '@/utils/getFilterParams.js'
import { Request, Response } from 'express'

// Helper function to extract group number for sorting
function extractGroupNumber(groupName: string): [number, string] {
  // Match "Группа-123A" or "Группа-123" etc.
  const match = groupName.match(/Группа-(\d+)([A-Za-zА-Яа-я]*)/)
  if (match) {
    const num = parseInt(match[1], 10)
    const suffix = match[2] || ''
    return [num, suffix]
  }
  // fallback: try to find any number
  const fallback = groupName.match(/(\d+)/)
  if (fallback) {
    return [parseInt(fallback[1], 10), '']
  }
  return [0, groupName]
}

function groupNameSorter(a: any, b: any) {
  const [numA, suffixA] = extractGroupNumber(a.group)
  const [numB, suffixB] = extractGroupNumber(b.group)
  if (numA !== numB) {
    return numA - numB
  }
  // If numbers are equal, compare suffixes lexicographically
  return suffixA.localeCompare(suffixB, 'ru')
}

const getGroupNames = async (req: Request, res: Response) => {
  try {
    const names = await Group.find(getFilterParams(req), {
      dates: 0,
    })

    // Sort group names before sending
    const sortedNames = [...names].sort(groupNameSorter)

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

    // Sort group names before sending
    const sortedNames = [...names].sort(groupNameSorter)

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
