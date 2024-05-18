import express from 'express'
import bodyParser from 'body-parser'
import { mongoose } from 'mongoose'
import { groupRouter } from './src/database/routes/group.route.js'
const app = express()
const PORT = process.env.PORT || 3000

app.use(bodyParser.json({ limit: '50mb' }))
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true, parameterLimit: 50000 }))
app.use('/api/groups', groupRouter)

app.get('/', (req, res) => {
  res.send('hello')
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
