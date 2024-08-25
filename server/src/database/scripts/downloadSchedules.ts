import axios from 'axios'
import { parse } from 'node-html-parser'
import path from 'path'
import fs from 'fs'
import crypto from 'crypto'
import { UNIVERSITY_URL } from '@/config/index'
import { IPathMap } from '@/types'

const __dirname = path.resolve()

const hashPath = (path: string) => {
  return crypto.createHash('md5').update(path).digest('hex')
}

const clearDirectory = (directory: string) => {
  if (fs.existsSync(directory)) {
    fs.readdirSync(directory).forEach((file) => {
      const filePath = path.join(directory, file)
      if (fs.lstatSync(filePath).isFile()) {
        fs.unlinkSync(filePath)
      }
    })
  }
}

const downloadFile = async (fileUrl: string, fileName: string) => {
  const fileResponse = await axios({
    method: 'get',
    url: fileUrl,
    responseType: 'stream',
  })

  const writer = fs.createWriteStream(fileName)
  fileResponse.data.pipe(writer)

  return new Promise((resolve, reject) => {
    writer.on('finish', resolve)
    writer.on('error', reject)
  })
}

const main = async () => {
  try {
    const response = await axios.get(UNIVERSITY_URL)
    const html = response.data

    const root = parse(html)

    const sections = root.querySelectorAll('.views-row')

    const baseDirectory = path.join(__dirname, 'docs', 'XLSXFiles')

    if (!fs.existsSync(baseDirectory)) {
      fs.mkdirSync(baseDirectory, { recursive: true })
    } else {
      clearDirectory(baseDirectory)
    }

    const mappingsFile = path.join(baseDirectory, 'pathMappings.json')
    let pathMappings = {} as IPathMap

    if (fs.existsSync(mappingsFile)) {
      pathMappings = JSON.parse(fs.readFileSync(mappingsFile, 'utf8'))
    }

    for (const section of sections) {
      const headerElement = section.querySelector('h2')
      if (headerElement) {
        let sectionTitle = headerElement.text.trim()
        let parentDir

        if (sectionTitle.toLowerCase().includes('магистратура')) {
          parentDir = 'Магистратура'
          sectionTitle = sectionTitle.replace(/^\d+\.\s*магистратура.\s*/i, '').trim()
        } else if (sectionTitle.toLowerCase().includes('аспирантура')) {
          parentDir = 'Аспирантура'
          sectionTitle = sectionTitle.replace(/^\d+\.\s*аспирантура.\с*/i, '').trim()
        } else {
          parentDir = 'Бакалавриат'
          sectionTitle = sectionTitle.replace(/^\d+\.\s*/, '').trim()
        }

        const fileLinkElements = section.querySelectorAll('a[href$=".xlsx"]')

        if (fileLinkElements.length > 0) {
          for (const fileLinkElement of fileLinkElements) {
            const fileUrl = fileLinkElement.getAttribute('href')

            if (!fileUrl) {
              continue
            }

            const fileName = fileLinkElement.text.trim()
            let courseDir = 'Прочее'

            const courseMatch = fileName.match(/^(\d+)\s*курс/i)
            if (courseMatch) {
              courseDir = `${courseMatch[1]} курс`
            }

            const uniqueSuffix = `${Date.now()}-${Math.floor(Math.random() * 10000)}`
            const hashedFileName = `${hashPath(fileName + uniqueSuffix)}.xlsx`
            const filePath = path.join(baseDirectory, hashedFileName)

            await downloadFile(fileUrl, filePath)

            pathMappings[hashedFileName] = {
              educationType: parentDir,
              faculty: sectionTitle,
              course: courseDir,
              fileName: fileName.replace(/^(\d+)\s*курс./i, '').trim(),
            }

            console.log(`Файл ${fileName} успешно загружен как ${hashedFileName}!`)
          }
        } else {
          console.error(`Ссылки на файлы не найдены в разделе "${sectionTitle}".`)
        }
      }
    }

    fs.writeFileSync(mappingsFile, JSON.stringify(pathMappings, null, 2))
    console.log('Все файлы успешно загружены и сохранены.')
  } catch (error) {
    console.error('Ошибка при загрузке файлов:', error)
  }
}

main()
