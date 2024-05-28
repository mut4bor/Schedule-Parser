import { data } from '../../api/scheduleParser.js'
import fetch from 'node-fetch'
import { useEnv } from '../../hooks/useEnv.js'
useEnv()

const url = process.env.FETCH_URL
const password = process.env.X_ADMIN_PASSWORD

const dataEntries = Object.entries(data)

dataEntries.forEach(([group, weeks], index) => {
  const dataToFetch = {
    group: group,
    date: weeks,
    index: index + 1,
  }

  fetch(`${url}/groups`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-admin-password': password,
    },
    body: JSON.stringify(dataToFetch),
  })
    .then(async (response) => {
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(`Error ${response.status}: ${errorData.message}`)
      }
      return response.json()
    })
    .then(() => {
      console.log(`Successfully created!: ${group}`)
    })
    .catch((error) => {
      console.error('Error:', error)
    })
})
