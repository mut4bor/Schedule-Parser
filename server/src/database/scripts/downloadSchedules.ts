import axios from 'axios'
import { parse, HTMLElement } from 'node-html-parser'
import path from 'path'
import fs from 'fs'
import crypto from 'crypto'
import { UNIVERSITY_URL } from '@/config'
import { IPathMap } from '@/types'

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

export const downloadSchedules = async () => {
  try {
    const response = await axios.get(UNIVERSITY_URL)
    const html = response.data

    const root = parse(html)

    const sections = root.querySelectorAll('.views-row')
    const __dirname = path.resolve()
    const baseDirectory = path.join(__dirname, 'docs', 'XLSXFiles')

    if (fs.existsSync(baseDirectory)) {
      clearDirectory(baseDirectory)
    } else {
      fs.mkdirSync(baseDirectory, { recursive: true })
    }

    const mappingsFile = path.join(baseDirectory, 'pathMappings.json')
    let pathMappings: IPathMap = {}

    // Проверяем, существует ли файл с маппингами, и если да, читаем его содержимое
    if (fs.existsSync(mappingsFile)) {
      pathMappings = JSON.parse(fs.readFileSync(mappingsFile, 'utf8'))
    }

    // Функция для обработки каждого раздела
    const processSection = async (section: HTMLElement) => {
      const headerElement = section.querySelector('h2')
      if (headerElement) {
        let sectionTitle = headerElement.textContent?.trim() || ''
        let educationType: string

        if (sectionTitle.toLowerCase().includes('магистратура')) {
          educationType = 'Магистратура'
          sectionTitle = sectionTitle.replace(/^\d+\.\s*магистратура.\s*/i, '').trim()
        } else if (sectionTitle.toLowerCase().includes('аспирантура')) {
          educationType = 'Аспирантура'
          sectionTitle = sectionTitle.replace(/^\d+\.\s*аспирантура.\с*/i, '').trim()
        } else {
          educationType = 'Бакалавриат'
          sectionTitle = sectionTitle.replace(/^\d+\.\s*/, '').trim()
        }

        const fileLinkElements = section.querySelectorAll('a[href$=".xlsx"]')

        if (fileLinkElements.length > 0) {
          await Promise.all(
            Array.from(fileLinkElements).map(async (fileLinkElement) => {
              const fileUrl = fileLinkElement.getAttribute('href')

              if (fileUrl) {
                const fileName = fileLinkElement.textContent?.trim() || ''
                let courseDir = 'Прочее'

                const courseMatch = fileName.match(/(\d+)\s*курс/i)
                if (courseMatch) {
                  courseDir = `${courseMatch[1]} курс`
                }

                const uniqueSuffix = `${Date.now()}-${Math.floor(Math.random() * 10000)}`
                const hashedFileName = `${hashPath(fileName + uniqueSuffix)}.xlsx`
                const filePath = path.join(baseDirectory, hashedFileName)

                await downloadFile(fileUrl, filePath)

                pathMappings[hashedFileName] = {
                  educationType: educationType,
                  faculty: sectionTitle,
                  course: courseDir,
                  fileName: fileName.replace(/^(\d+)\s*курс./i, '').trim(),
                }

                console.log(`Файл ${fileName} успешно загружен как ${hashedFileName}!`)
              }
            }),
          )
        } else {
          console.error(`Ссылки на файлы не найдены в разделе "${sectionTitle}".`)
        }
      }
    }

    // Основная функция для обработки всех разделов и записи в файл
    const processAllSections = async () => {
      await Promise.all(sections.map(processSection))

      // Записываем обновленные маппинги в файл
      fs.writeFileSync(mappingsFile, JSON.stringify(pathMappings, null, 2))

      console.log('Маппинги успешно записаны в файл.')
    }

    // Запускаем обработку всех разделов
    await processAllSections()
  } catch (error) {
    console.error('Ошибка при загрузке файлов:', error)
  }
}
