import { data } from '../../api/getData.js'
import fetch from 'node-fetch'
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
    return response.json()
  })
  .then((data) => {
    return data
  })
  .catch((error) => {
    return error
  })

const dataEntries = Object.entries(data)

dataEntries.forEach(([group, weeks], index) => {
  const dataToFetch = {
    group: group,
    date: weeks,
    index: index + 1,
  }

  fetch(
    `${url}/groups/${fetchGroupNames.find((groupObject) => groupObject.group === group)._id}`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-password': password,
      },
      body: JSON.stringify(dataToFetch),
    },
  )
    .then(async (response) => {
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(`Error ${response.status}: ${errorData.message}`)
      }
      return response.json()
    })
    .then(() => {
      console.log(`Successfully updated!: ${group}`)
    })
    .catch((error) => {
      console.error('Error:', error)
    })
})
