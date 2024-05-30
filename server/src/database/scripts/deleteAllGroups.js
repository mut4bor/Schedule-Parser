import fetch from 'node-fetch'
import { useEnv } from '../../hooks/useEnv.js'
useEnv()

const url = process.env.FETCH_URL
const password = process.env.X_ADMIN_PASSWORD

fetch(`${url}/groups`, {
  method: 'DELETE',
  headers: {
    'x-admin-password': password,
  },
})
  .then(async (response) => {
    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(`Error ${response.status}: ${errorData.message}`)
    }
    console.log('Successfully deleted!')
  })
  .catch((error) => {
    console.error('Error:', error.message)
  })
