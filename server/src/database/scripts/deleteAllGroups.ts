import { FETCH_URL, X_ADMIN_PASSWORD } from '@/config/index.js'

export const deleteAllGroups = async () => {
  try {
    const response = await fetch(`${FETCH_URL}/groups`, {
      method: 'DELETE',
      headers: {
        'x-admin-password': X_ADMIN_PASSWORD,
      },
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(`Error ${response.status}: ${errorData.message}`)
    }

    console.log('Successfully deleted!')
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Error:', error.message)
    } else {
      console.error('Error:', String(error))
    }
  }
}
