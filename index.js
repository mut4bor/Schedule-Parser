import express from 'express'
import path from 'path'
import { parsedJson, unParsedJson } from './src/api/scheduleParser.js'
const app = express()
const __dirname = path.resolve()
const PORT = process.env.PORT || 3000

app.get('/api/schedule', (req, res) => {
  res.status(200).json(parsedJson)
})

app.use(express.static(path.resolve(__dirname, 'static')))

app.listen(PORT, () => console.log(`Server running on port ${PORT}...`))
//
// Object.entries(result).forEach(([sheetName, sheetData]) => {
//   content[sheetName] = sheetData.reduce((acc, item, index) => {
//     const { A: date, B: day, C: time, F: name } = item
//     const classDate = `${date ? date : ''} - ${day ? day : ''}`
//     const classTimeName = `${time ? time : ''} - ${name ? name : ''}`
//     const groupIndex = Math.floor(index / 5) + 1
//     return {
//       ...acc,
//       [classDate]: {
//         ...acc[classDate],
//         [groupIndex]: classTimeName,
//       },
//     }
//   }, {})
// })
