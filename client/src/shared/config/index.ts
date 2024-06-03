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

const NODE_ENV = getEnvVar('NODE_ENV')

const BASE_URL = getEnvVar('BASE_URL')
const FACULTIES_PATH = getEnvVar('FACULTIES_PATH')
const COURSES_PATH = getEnvVar('COURSES_PATH')
const GROUPS_PATH = getEnvVar('GROUPS_PATH')
const GROUP_ID_PATH = getEnvVar('GROUP_ID_PATH')

const API_URL = getEnvVar('API_URL')
const X_ADMIN_PASSWORD = getEnvVar('X_ADMIN_PASSWORD')

const isDevEnv = NODE_ENV === 'development'

const isProdEnv = NODE_ENV === 'production'

export {
  NODE_ENV,
  BASE_URL,
  FACULTIES_PATH,
  COURSES_PATH,
  GROUPS_PATH,
  GROUP_ID_PATH,
  API_URL,
  X_ADMIN_PASSWORD,
  isDevEnv,
  isProdEnv,
}
