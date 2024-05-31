import fetch from 'node-fetch'
import { useEnv } from '../../hooks/useEnv.js'
import { data } from '../../api/getData.js'

useEnv()

const url = process.env.FETCH_URL
const password = process.env.X_ADMIN_PASSWORD

async function sendData(dataToFetch) {
  try {
    const response = await fetch(`${url}/groups`, {
      method: 'POST',
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

    console.log(`Successfully created!: ${dataToFetch.group}`)
  } catch (error) {
    console.error('Error:', error)
  }
}

async function processData() {
  for (const [educationType, facultyData] of Object.entries(data)) {
    for (const [faculty, courseData] of Object.entries(facultyData)) {
      for (const [course, groupData] of Object.entries(courseData)) {
        for (const [group, dates] of Object.entries(groupData)) {
          const dataToFetch = {
            educationType,
            faculty,
            course,
            group,
            dates,
          }

          await sendData(dataToFetch)
        }
      }
    }
  }
}

processData()
