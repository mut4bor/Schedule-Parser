import { FETCH_URL, X_ADMIN_PASSWORD } from '@/config/index'

fetch(`${FETCH_URL}/groups`, {
  method: 'DELETE',
  headers: {
    'x-admin-password': X_ADMIN_PASSWORD,
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
