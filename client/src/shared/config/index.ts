const getEnvVar = (key: string) => {
  if (import.meta.env[key] === undefined) {
    throw new Error(`Env variable ${key} is required`)
  }
  return import.meta.env[key] || ''
}

const API_URL = getEnvVar('VITE_API_URL')
const X_ADMIN_PASSWORD = getEnvVar('VITE_X_ADMIN_PASSWORD')

export { API_URL, X_ADMIN_PASSWORD }
