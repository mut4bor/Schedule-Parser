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

export const env = {
  NODE_ENV: getEnvVar('NODE_ENV'),
  PRODUCTION_DOMAIN: getEnvVar('PRODUCTION_DOMAIN'),
  PORT: getEnvVar('PORT'),
  JWT_SECRET: getEnvVar('JWT_SECRET'),
  ADMIN_PASSWORD: getEnvVar('ADMIN_PASSWORD'),
  MONGODB_URL: getEnvVar('MONGODB_URL'),
}
