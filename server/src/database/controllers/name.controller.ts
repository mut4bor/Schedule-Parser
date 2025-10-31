import { Group } from '@/database/models/group.model.js'
import { getFilterParams } from '@/utils/getFilterParams.js'
import { Request, Response } from 'express'

// Helper function to extract group number for sorting
function extractGroupNumber(groupName?: string): [number, string] {
  if (!groupName || typeof groupName !== 'string') {
    return [0, '']
  }

  const match = groupName.match(/Группа-(\d+)([A-Za-zА-Яа-я]*)/)
  if (match) {
    const num = parseInt(match[1], 10)
    const suffix = match[2] || ''
    return [num, suffix]
  }

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

  return suffixA.localeCompare(suffixB, 'ru')
}

const getGroupNames = async (req: Request, res: Response) => {
  try {
    const names = await Group.find({ ...getFilterParams(req), groupName: { $exists: true, $ne: null } }, { dates: 0 })

    console.log('Groups before sorting:', names)

    // Sort group names before sending
    const sortedNames = [...names].sort(groupNameSorter)

    res.status(200).json(sortedNames)
  } catch (error) {
    res.status(500).json({
      message: error instanceof Error ? error.message : 'Неизвестная ошибка',
    })
  }
}

const getGroupNamesThatMatchWithReqParams = async (req: Request, res: Response) => {
  try {
    const { searchValue } = req.query
    if (!searchValue) {
      return res.status(400).json({ message: 'Значение поиска обязательно' })
    }

    const regex = new RegExp(searchValue as string, 'i')
    const names = await Group.find(
      { group: { $regex: regex } },
      {
        group: 1,
        _id: 1,
      },
    )

    // Sort group names before sending
    const sortedNames = [...names].sort(groupNameSorter)

    res.status(200).json(sortedNames)
  } catch (error) {
    res.status(500).json({
      message: error instanceof Error ? error.message : 'Неизвестная ошибка',
    })
  }
}

export { getGroupNames, getGroupNamesThatMatchWithReqParams }
