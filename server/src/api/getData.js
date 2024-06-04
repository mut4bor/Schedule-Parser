import fs from 'fs'
import path from 'path'
import { getProcessedDataForFile } from './getProcessedDataForFile.js'

async function getData(dirPath) {
  const result = []

  const mappingsFile = path.join(dirPath, 'pathMappings.json')

  let pathMappings = {}
  if (fs.existsSync(mappingsFile)) {
    pathMappings = JSON.parse(fs.readFileSync(mappingsFile, 'utf8'))
  }

  Object.entries(pathMappings).forEach(async ([fileName, fileInformation]) => {
    const fullPath = path.join(dirPath, fileName)
    const data = await getProcessedDataForFile(fullPath)

    Object.entries(data).forEach(([group, dates]) => {
      result.push({
        educationType: fileInformation.educationType,
        faculty: fileInformation.faculty,
        course: fileInformation.course,
        group: group,
        dates: dates,
      })
    })
  })

  return result
}
const __dirname = path.resolve()
const __XLSXFilesDir = path.join(__dirname, 'docs', 'XLSXFiles')
const data = await getData(__XLSXFilesDir)
export { data }
