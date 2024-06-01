import fs from 'fs'
import path from 'path'
import { getProcessedDataForFile } from './getProcessedDataForFile.js'

async function createDirectoryStructure(dirPath) {
  let result = []

  const files = await fs.promises.readdir(dirPath)

  for (const file of files) {
    const fullPath = path.join(dirPath, file)
    const stat = await fs.promises.stat(fullPath)
    const pathParts = fullPath.split(path.sep)
    const startIndex = pathParts.indexOf('docs') + 2
    const relevantPathParts = pathParts.slice(startIndex)
    if (stat.isDirectory()) {
      const nestedResults = await createDirectoryStructure(fullPath)
      result = result.concat(nestedResults)
    } else {
      const data = await getProcessedDataForFile(fullPath)
      Object.entries(data).forEach(([group, dates]) => {
        result.push({
          educationType: relevantPathParts[0],
          faculty: relevantPathParts[1],
          course: relevantPathParts[2],
          group: group,
          dates: dates,
        })
      })
    }
  }

  return result
}
const __dirname = path.resolve()
const __XLSXFilesDir = path.join(__dirname, 'docs', 'XLSXFiles')
const data = await createDirectoryStructure(__XLSXFilesDir)
export { data }
