import { data } from '../../api/scheduleParser.js'
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

const isDatabaseEmpty = !fetchGroupNames.length

Object.entries(data).forEach(([group, weeks]) => {
  const dataToFetch = {
    group: typeof group === 'string' ? group : group.toString(),
    date: weeks,
  }

  const options = {
    method: isDatabaseEmpty ? 'POST' : 'PUT',
    url: isDatabaseEmpty ? '' : `${fetchGroupNames.find((groupObject) => groupObject.group === group)._id}`,
    successText: isDatabaseEmpty ? 'created' : 'updated',
  }

  fetch(`${url}/groups/${options.url}`, {
    method: options.method,
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
      console.log(`Successfully ${options.successText}!: ${group}`)
    })
    .catch((error) => {
      console.error('Error:', error)
    })
})
