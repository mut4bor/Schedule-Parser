import path from 'path'
import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'
import { router } from '@/database/routes/route'
import { PORT, MONGODB_URL, PRODUCTION_DOMAIN, NODE_ENV } from '@/config'
import AdminJS from 'adminjs'
import AdminJSExpress from '@adminjs/express'

const app = express()
const HOST_PORT = PORT || 3000
const __client = path.join(path.resolve(), '../', 'client')
const __clientBuild = path.join(__client, 'dist')

const corsOptions = {
  origin: NODE_ENV === 'production' ? PRODUCTION_DOMAIN : '*',
}

app.use(express.static(__clientBuild))
app.use(cors(corsOptions))
app.use(bodyParser.json({ limit: '50mb' }))
app.use(
  bodyParser.urlencoded({
    limit: '50mb',
    extended: true,
    parameterLimit: 50000,
  }),
)

app.use('/api', router)

app.get('/*', (req, res) => {
  res.sendFile(path.join(__clientBuild, 'index.html'))
})

const admin = new AdminJS({})

const adminRouter = AdminJSExpress.buildRouter(admin)
app.use(admin.options.rootPath, adminRouter)

mongoose
  .connect(MONGODB_URL)
  .then(() => {
    console.log('Connected to database!')
    app.listen(HOST_PORT, () => console.log(`Server running on port ${HOST_PORT}...`))
  })
  .catch(() => {
    console.log('Connection to database failed')
  })
