import express from 'express'
import path from 'path'
import { content, result } from './src/api/scheduleParser.js'
const app = express()
const __dirname = path.resolve()
const PORT = process.env.PORT || 3000

app.get('/api/schedule', (req, res) => {
  res.status(200).json(result)
})

app.use(express.static(path.resolve(__dirname, 'static')))

app.listen(PORT, () => console.log(`Server running on port ${PORT}...`))
