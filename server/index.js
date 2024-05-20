import path from 'path'
import express from 'express'
import bodyParser from 'body-parser'
import { mongoose } from 'mongoose'
import { groupRouter } from './src/database/routes/group.route.js'
// import { data } from './src/api/scheduleParser.js'
const app = express()
const PORT = process.env.PORT || 3000
const __dirname = path.resolve()
const __public = path.join(__dirname, 'public')

app.use(bodyParser.json({ limit: '50mb' }))
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true, parameterLimit: 50000 }))
app.use('/api/groups', groupRouter)

app.get('/', (req, res) => {
  res.sendFile(path.join(__public, 'index.html'))
})

// app.get('/api/parsed', (req, res) => {
//   res.json(data)
// })

app.get('*', (req, res) => {
  res.sendFile(path.join(__public, 'error.html'))
})

mongoose
  .connect(
    'mongodb+srv://admin:PLc2KFZvOCFpi0Rz@scheduleparserdb.xr1qrva.mongodb.net/Node-API?retryWrites=true&w=majority&appName=scheduleParserDB',
  )
  .then(() => {
    console.log('Connected to database!')
    app.listen(PORT, () => console.log(`Server running on port ${PORT}...`))
  })
  .catch(() => {
    console.log('Connection to database failed')
  })
