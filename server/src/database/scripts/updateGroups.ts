import { getData } from '@/api/getData'
import path from 'path'
import { FETCH_URL, X_ADMIN_PASSWORD } from '@/config'
import { IGroup } from '@/types'

const fetchGroupNames = async () => {
  const response = await fetch(`${FETCH_URL}/names`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'x-admin-password': X_ADMIN_PASSWORD,
    },
  })
  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(`Error ${response.status}: ${errorData.message}`)
  }
  return await response.json()
}

const putData = async (dataToFetch: IGroup) => {
  try {
    const groupNames = await fetchGroupNames()

    const idToFetch = `${groupNames.find((groupData: { group: string }) => groupData.group === dataToFetch.group)._id}`
    const response = await fetch(`${FETCH_URL}/groups/${idToFetch}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-password': X_ADMIN_PASSWORD,
      },
      body: JSON.stringify(dataToFetch),
    })
    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(`Error ${response.status}: ${errorData.message}`)
    }
    console.log(`Successfully updated!: ${dataToFetch.group}`)
  } catch (error) {
    console.error('Error:', error)
  }
}

export const updateGroups = async () => {
  const __dirname = path.resolve()
  const __XLSXFilesDir = path.join(__dirname, 'docs', 'XLSXFiles')
  const data = await getData(__XLSXFilesDir)

  const promises = data.map(async (groupObject: IGroup, index) => {
    groupObject['index'] = index
    await putData(groupObject)
  })
  try {
    await Promise.all(promises)
  } catch (error) {
    console.error('Error:', error)
  }
}
