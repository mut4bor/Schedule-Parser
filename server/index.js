import express from 'express'
import path from 'path'
import { allData } from './src/api/scheduleParser.js'
import { mongoose } from 'mongoose'
const app = express()
const __dirname = path.resolve()
const PORT = process.env.PORT || 3000
import { Group } from './models/product.model.js'

app.use(express.json())

app.get('/', (req, res) => {
  res.send('hello')
})

app.get('/api/schedule/:id', async (req, res) => {
  try {
    const { id } = req.params
    const group = await Group.findById(id)
    res.status(200).json(group)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

app.get('/api/schedules', async (req, res) => {
  try {
    const groups = await Group.find({})
    res.status(200).json(groups)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

app.post('/api/schedules', async (req, res) => {
  try {
    const group = await Group.create(req.body)
    res.status(200).json(group)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

app.put('/api/schedule/:id', async (req, res) => {
  try {
    const { id } = req.params
    const group = await Group.findByIdAndUpdate(id)
    res.status(200).json(group)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
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
