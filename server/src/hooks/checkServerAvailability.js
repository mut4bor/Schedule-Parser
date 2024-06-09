import http from 'http'
import { useEnv } from './useEnv.js'
useEnv()

async function checkServerAvailability(host, port, timeout = 2000) {
  return new Promise((resolve) => {
    const options = {
      host: host,
      port: port,
      timeout: timeout,
    }

    const request = http.request(options, (res) => {
      if (res.statusCode === 200) {
        resolve(true)
      } else {
        resolve(false)
      }
    })

    request.on('error', () => {
      resolve(false)
    })

    request.end()
  })
}

export async function waitUntilServerIsAvailable(interval = 5000) {
  const host = process.env.SERVER_HOST_NAME
  const port = process.env.PORT

  let isAvailable = await checkServerAvailability(host, port)
  while (!isAvailable) {
    console.log('Server not available, waiting...')
    await new Promise((resolve) => setTimeout(resolve, interval))
    isAvailable = await checkServerAvailability(host, port)
  }
  console.log('Server is now available.')
}
