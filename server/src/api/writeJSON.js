import path from 'path'
import { writeFileSync } from 'fs'
import { allData } from './scheduleParser.js'

const __dirname = path.resolve()
const jsonPath = path.join(__dirname, 'docs', 'JSONFiles', 'schedule.json')

try {
  writeFileSync(jsonPath, JSON.stringify(allData, null, 2), 'utf8')
  console.log('Data successfully saved to disk')
} catch (error) {
  console.log('An error has occurred ', error)
}
