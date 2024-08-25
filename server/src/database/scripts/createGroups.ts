import { getData } from '@/api/getData'
import { FETCH_URL, X_ADMIN_PASSWORD } from '@/config/index'
import { IGroup } from '@/types'
import path from 'path'

const postData = async (dataToFetch: IGroup) => {
  try {
    const response = await fetch(`${FETCH_URL}/groups`, {
      method: 'POST',
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
    console.log(`Successfully created!: ${dataToFetch.group}`)
  } catch (error) {
    console.error('Error:', error)
  }
}

const sendData = async () => {
  const __dirname = path.resolve()
  const __XLSXFilesDir = path.join(__dirname, 'docs', 'XLSXFiles')
  const data = await getData(__XLSXFilesDir)

  const promises = data.map(async (groupObject: IGroup, index) => {
    groupObject['index'] = index

    await postData(groupObject)
  })
  try {
    await Promise.all(promises)
  } catch (error) {
    console.error('Error:', error)
  }
}

sendData()
