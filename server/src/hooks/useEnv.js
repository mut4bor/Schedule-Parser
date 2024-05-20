import path from 'path'
import dotenv from 'dotenv'

const useEnv = () => {
  const __dirname = path.resolve()
  const envPath = path.resolve(__dirname, '.env')
  dotenv.config({ path: envPath })
}

export { useEnv }
