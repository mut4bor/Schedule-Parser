import { data } from '../../api/getData.js'
import fetch from 'node-fetch'
import { waitUntilServerIsAvailable } from '../../hooks/checkServerAvailability.js'
import { useEnv } from '../../hooks/useEnv.js'
useEnv()

const url = process.env.FETCH_URL
const password = process.env.X_ADMIN_PASSWORD

const fetchGroupNames = await fetch(`${url}/names`, {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
    'x-admin-password': password,
  },
})
  .then(async (response) => {
    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(`Error ${response.status}: ${errorData.message}`)
    }
    return await response.json()
  })
  .then((data) => {
    return data
  })
  .catch((error) => {
    return error
  })

async function putData(dataToFetch) {
  try {
    const idToFetch = `${fetchGroupNames.find((groupData) => groupData.group === dataToFetch.group)._id}`
    const response = await fetch(`${url}/groups/${idToFetch}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-password': password,
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
async function sendData() {
  const promises = data.map(async (groupObject, index) => {
    groupObject['index'] = index
    await putData(groupObject)
  })
  try {
    await Promise.all(promises)
  } catch (error) {
    console.error('Error:', error)
  }
}

;(async function main() {
  await waitUntilServerIsAvailable()
  await sendData()
})()
