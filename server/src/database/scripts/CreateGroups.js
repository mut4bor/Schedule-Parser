import { data } from '../../api/scheduleParser.js'
import fetch from 'node-fetch'
import { useEnv } from '../../hooks/useEnv.js'
useEnv()

const url = process.env.FETCH_URL

Object.entries(data).forEach(([group, weeks]) => {
  const dataToFetch = {
    group: group,
    date: weeks,
  }
  fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(dataToFetch),
  })
    .then((response) => response.json())
    .then(() => {
      console.log('Success:', group)
    })
    .catch((error) => {
      console.error('Error:', error)
    })
})
