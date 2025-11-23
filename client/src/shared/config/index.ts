const getEnvVar = (key: string) => {
  if (import.meta.env[key] === undefined) {
    throw new Error(`Env variable ${key} is required`)
  }
  return import.meta.env[key] || ''
}

const env = {
  API_URL: getEnvVar('VITE_API_URL'),
  WEBSOCKET_URL: getEnvVar('VITE_WEBSOCKET_URL'),
}

export { env }
