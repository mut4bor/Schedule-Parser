import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'
import { router } from '@/database/routes/route.js'
import { PORT, MONGODB_URL, PRODUCTION_DOMAIN, NODE_ENV } from '@/config/index.js'

const app = express()
const HOST_PORT = PORT || 3000

const corsOptions = {
  origin: NODE_ENV === 'production' ? PRODUCTION_DOMAIN : '*',
}

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
  .connect(MONGODB_URL)
  .then(() => {
    console.log('✅ Connected to database!')
    app.listen(HOST_PORT, () => {
      console.log(`🚀 Server running on port ${HOST_PORT}...`)
    })
  })
  .catch(() => {
    console.log('❌ Connection to database failed')
  })
