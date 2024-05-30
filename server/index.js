import path from 'path'
import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import { mongoose } from 'mongoose'
import { router } from './src/database/routes/route.js'
import { useEnv } from './src/hooks/useEnv.js'
useEnv()

const app = express()
const PORT = process.env.PORT || 3000
const __dirname = path.resolve()
const __public = path.join(__dirname, 'public')
const __build = path.join(__dirname, '../', 'client', 'build')
app.use(express.static(__build))
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
app.use('/api', router)

app.get('/*', (req, res) => {
  res.sendFile(path.join(__build, 'index.html'))
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
