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

const NODE_ENV = getEnvVar('NODE_ENV')
const MONGODB_URL = getEnvVar('MONGODB_URL')
const PORT = getEnvVar('PORT')
const X_ADMIN_PASSWORD = getEnvVar('X_ADMIN_PASSWORD')
const FETCH_URL = getEnvVar('FETCH_URL')
const PRODUCTION_DOMAIN = getEnvVar('PRODUCTION_CLIENT_DOMAIN')
const UNIVERSITY_URL = getEnvVar('UNIVERSITY_URL')
const SERVER_HOST_NAME = getEnvVar('SERVER_HOST_NAME')
const REFRESH_PASSWORD = getEnvVar('REFRESH_PASSWORD')
const DB_DATABASE = getEnvVar('DB_DATABASE')
const DB_HOST = getEnvVar('DB_HOST')
const DB_PORT = getEnvVar('DB_PORT')
const DB_USERNAME = getEnvVar('DB_USERNAME')
const DB_PASSWORD = getEnvVar('DB_PASSWORD')

export {
  NODE_ENV,
  MONGODB_URL,
  PORT,
  X_ADMIN_PASSWORD,
  FETCH_URL,
  PRODUCTION_DOMAIN,
  UNIVERSITY_URL,
  SERVER_HOST_NAME,
  REFRESH_PASSWORD,
  DB_DATABASE,
  DB_HOST,
  DB_PORT,
  DB_USERNAME,
  DB_PASSWORD,
}
