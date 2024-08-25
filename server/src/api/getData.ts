import fs from 'fs'
import path from 'path'
import { getProcessedDataForFile } from '@/api/getProcessedDataForFile'
import { IGroup, IPathMap } from '@/types'

export async function getData(dirPath: string): Promise<IGroup[]> {
  const mappingsFile = path.join(dirPath, 'pathMappings.json')

  if (!fs.existsSync(mappingsFile)) {
    return Promise.reject(new Error(`Mappings file not found at ${mappingsFile}`))
  }

  const pathMappings = JSON.parse(fs.readFileSync(mappingsFile, 'utf8')) as IPathMap

  const dataPromises = Object.entries(pathMappings).map(async ([fileName, fileInformation]) => {
    const fullPath = path.join(dirPath, fileName)
    const data = await getProcessedDataForFile(fullPath)

    return Object.entries(data).map(([group, dates]) => ({
      educationType: fileInformation.educationType,
      faculty: fileInformation.faculty,
      course: fileInformation.course,
      group: group,
      dates: dates,
    }))
  })

  const results = await Promise.all(dataPromises)
  return results.flat()
}
