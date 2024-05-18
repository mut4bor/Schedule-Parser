import { allData } from './scheduleParser.js'

import fetch from 'node-fetch'

const url = 'http://localhost:3000/api/groups'

Object.entries(allData).forEach(([group, weeks]) => {
  const data = {
    group: group,
    date: weeks,
  }
  fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log('Success:', group)
    })
    .catch((error) => {
      console.error('Error:', error)
    })
})
