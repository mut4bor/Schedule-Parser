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

function listRoutes(app: express.Express) {
  const routes: { method: string; path: string }[] = []

  app._router.stack.forEach((middleware: any) => {
    if (middleware.route) {
      const methods = Object.keys(middleware.route.methods)
      methods.forEach((method) => {
        routes.push({ method: method.toUpperCase(), path: middleware.route.path })
      })
    } else if (middleware.name === 'router') {
      middleware.handle.stack.forEach((handler: any) => {
        if (handler.route) {
          const methods = Object.keys(handler.route.methods)
          methods.forEach((method) => {
            routes.push({
              method: method.toUpperCase(),
              path: '/api' + handler.route.path,
            })
          })
        }
      })
    }
  })

  console.log('\n📌 Available routes:')
  routes.forEach((r) => console.log(`- [${r.method}] ${r.path}`))
  console.log('')
}

mongoose
  .connect(MONGODB_URL)
  .then(() => {
    console.log('✅ Connected to database!')
    app.listen(HOST_PORT, () => {
      console.log(`🚀 Server running on port ${HOST_PORT}...`)
      listRoutes(app)
    })
  })
  .catch(() => {
    console.log('❌ Connection to database failed')
  })
