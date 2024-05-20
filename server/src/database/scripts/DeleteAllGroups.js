import fetch from 'node-fetch'
import { useEnv } from '../../hooks/useEnv.js'
useEnv()

const url = process.env.FETCH_URL

fetch(url, {
  method: 'DELETE',
})
  .then(() => console.log('Successfully deleted!'))
  .catch((error) => {
    console.error('Error:', error)
  })
