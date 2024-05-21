import { data } from '../../api/scheduleParser.js'
import fetch from 'node-fetch'
import { useEnv } from '../../hooks/useEnv.js'
useEnv()

const url = process.env.FETCH_URL

const fetchGroupNames = await fetch(url + '/names', {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
  },
})
  .then((response) => response.json())
  .then((data) => {
    return data
  })
  .catch((error) => {
    return error
  })

Object.entries(data).forEach(([group, weeks]) => {
  const dataToFetch = {
    group: typeof group === 'string' ? group : group.toString(),
    date: weeks,
  }
  const groupId = fetchGroupNames.find((groupObject) => groupObject.group === group)._id
  fetch(url + `/groups/${groupId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(dataToFetch),
  })
    .then((response) => response.json())
    .then(() => {
      console.log('Successfully updated:', group)
    })
    .catch((error) => {
      console.error('Error:', error)
    })
})
