import path from 'path'
import dotenv from 'dotenv'

const envPath = path.resolve(path.resolve(), '.env')

dotenv.config({ path: envPath })

const getEnvVar = (key: string) => {
  if (process.env[key] === undefined) {
    throw new Error(`Env variable ${key} is required`)
  }
  return process.env[key] || ''
}

const MONGODB_URL = getEnvVar('MONGODB_URL')
const PORT = getEnvVar('PORT')
const X_ADMIN_PASSWORD = getEnvVar('X_ADMIN_PASSWORD')
const FETCH_URL = getEnvVar('FETCH_URL')
const UNIVERSITY_URL = getEnvVar('UNIVERSITY_URL')
const SERVER_HOST_NAME = getEnvVar('SERVER_HOST_NAME')
const REFRESH_PASSWORD = getEnvVar('REFRESH_PASSWORD')

export { MONGODB_URL, PORT, X_ADMIN_PASSWORD, FETCH_URL, UNIVERSITY_URL, SERVER_HOST_NAME, REFRESH_PASSWORD }
