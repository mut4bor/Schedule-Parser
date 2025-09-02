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

export const NODE_ENV = getEnvVar('NODE_ENV')
export const PRODUCTION_DOMAIN = getEnvVar('PRODUCTION_DOMAIN')
export const PORT = getEnvVar('PORT')
export const X_ADMIN_PASSWORD = getEnvVar('X_ADMIN_PASSWORD')
export const MONGODB_URL = getEnvVar('MONGODB_URL')
