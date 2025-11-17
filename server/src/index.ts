import express from 'express'
import http from 'http'
import bodyParser from 'body-parser'
import cors, { CorsOptions } from 'cors'
import mongoose from 'mongoose'
import { router } from '@/database/routes/route.js'
import { env } from '@/config/index.js'
import cookieParser from 'cookie-parser'
import { setupWebSocket } from '@/websocket/server.js'

const app = express()
const server = http.createServer(app)
const HOST_PORT = env.PORT || 3000

const corsOptions: CorsOptions = {
  origin: [env.PRODUCTION_DOMAIN, 'http://localhost:5173', 'http://localhost:4173'],
  credentials: true,
}

app.use(cookieParser())
app.use(cors(corsOptions))
app.use(bodyParser.json({ limit: '50mb' }))
app.use(
  bodyParser.urlencoded({
    limit: '50mb',
    extended: true,
    parameterLimit: 50000,
  }),
)

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' })
})

app.use('/api', router)

mongoose
  .connect(env.MONGODB_URL)
  .then(() => {
    console.log('✅ Connected to database!')

    setupWebSocket(server)
    console.log('🔌 WebSocket server initialized')

    server.listen(HOST_PORT, () => {
      console.log(`🚀 Server running on port ${HOST_PORT}...`)
    })
  })
  .catch((err) => {
    console.log('❌ Connection to database failed', err)
  })
