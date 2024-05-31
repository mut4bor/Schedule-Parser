import fs from 'fs'
import path from 'path'
import { getProcessedDataForFile } from './getProcessedDataForFile.js'

async function createDirectoryStructure(dirPath) {
  const result = {}
  const files = fs.readdirSync(dirPath)

  for (const file of files) {
    const fullPath = path.join(dirPath, file)
    const stat = fs.statSync(fullPath)

    if (stat.isDirectory()) {
      result[file] = await createDirectoryStructure(fullPath)
    } else {
      const data = await getProcessedDataForFile(fullPath)
      Object.entries(data).forEach(([group, dates]) => {
        result[group] = dates
      })
    }
  }

  return result
}

const __dirname = path.resolve()
const __XLSXFilesDir = path.join(__dirname, 'docs', 'XLSXFiles')
const data = await createDirectoryStructure(__XLSXFilesDir)
export { data }
