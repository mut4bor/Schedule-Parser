import path from 'path'
import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import { mongoose } from 'mongoose'
import { groupRouter } from './src/database/routes/group.route.js'
import { useEnv } from './src/hooks/useEnv.js'
useEnv()
import { data } from './src/api/scheduleParser.js'

const app = express()
const PORT = process.env.PORT || 3000
const __dirname = path.resolve()
const __public = path.join(__dirname, 'public')
app.use(cors())
app.options('*', cors())
app.use(bodyParser.json({ limit: '50mb' }))
app.use(
  bodyParser.urlencoded({
    limit: '50mb',
    extended: true,
    parameterLimit: 50000,
  }),
)
app.use('/api', groupRouter)

app.get('/', (req, res) => {
  res.sendFile(path.join(__public, 'index.html'))
})
app.get('/data', (req, res) => {
  res.json(data)
})

app.get('*', (req, res) => {
  res.sendFile(path.join(__public, 'error.html'))
})

const mongodbURL = process.env.MONGODB_URL

mongoose
  .connect(mongodbURL)
  .then(() => {
    console.log('Connected to database!')
    app.listen(PORT, () => console.log(`Server running on port ${PORT}...`))
  })
  .catch(() => {
    console.log('Connection to database failed')
  })
