import path from 'path'
import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'
import { router } from './database/routes/route'
import { PORT, mongodbURL } from './config/index'
import { getProcessedDataForFile } from './api/getProcessedDataForFile'
import { getJsonFromXLSX } from './api/getJsonFromXLSX'

const app = express()
const HOST_PORT = PORT || 3000
const __client = path.join(path.resolve(), '../', 'client')
const __clientBuild = path.join(__client, 'dist')

app.use(express.static(__clientBuild))
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

app.use('/data', async (req, res) => {
  const data = await getProcessedDataForFile(
    path.join(path.resolve(), 'docs/XLSXFiles/a4604827108e4e50331c65e2b5c05c76.xlsx'),
  )
  res.json(data)
})
app.use('/json', async (req, res) => {
  const jsonFromXLSX = getJsonFromXLSX(
    path.join(path.resolve(), 'docs/XLSXFiles/a4604827108e4e50331c65e2b5c05c76.xlsx'),
  )
  res.json(jsonFromXLSX)
})

app.get('/*', (req, res) => {
  res.sendFile(path.join(__clientBuild, 'index.html'))
})

mongoose
  .connect(mongodbURL)
  .then(() => {
    console.log('Connected to database!')
    app.listen(HOST_PORT, () => console.log(`Server running on port ${HOST_PORT}...`))
  })
  .catch(() => {
    console.log('Connection to database failed')
  })
