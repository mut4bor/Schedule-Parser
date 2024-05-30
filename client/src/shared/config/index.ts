/**
 * Getting env-variable
 * @throwable
 */
const getEnvVar = (key: string) => {
  if (process.env[key] === undefined) {
    throw new Error(`Env variable ${key} is required`)
  }
  return process.env[key] || ''
}

export const BASE_URL = getEnvVar('BASE_URL')
export const API_URL = getEnvVar('API_URL')
export const X_ADMIN_PASSWORD = getEnvVar('X_ADMIN_PASSWORD')

export const NODE_ENV = getEnvVar('NODE_ENV')

export const isDevEnv = NODE_ENV === 'development'

export const isProdEnv = NODE_ENV === 'production'
