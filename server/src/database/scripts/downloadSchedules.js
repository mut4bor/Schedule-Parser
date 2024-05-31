import axios from 'axios'
import { parse } from 'node-html-parser'
import path from 'path'
import fs from 'fs'
import { useEnv } from '../../hooks/useEnv.js'

useEnv()
const __dirname = path.resolve()

const pageUrl = process.env.UNIVERSITY_URL

try {
  const response = await axios.get(pageUrl)
  const html = response.data

  const root = parse(html)

  const sections = root.querySelectorAll('.views-row')

  sections.forEach((section) => {
    const headerElement = section.querySelector('h2')
    if (headerElement) {
      let sectionTitle = headerElement.text.trim()
      let parentDir

      if (sectionTitle.toLowerCase().includes('магистратура')) {
        parentDir = 'Магистратура'
        sectionTitle = sectionTitle
          .replace(/^\d+\.\s*магистратура.\s*/i, '')
          .trim()
      } else if (sectionTitle.toLowerCase().includes('аспирантура')) {
        parentDir = 'Аспирантура'
        sectionTitle = sectionTitle
          .replace(/^\d+\.\s*аспирантура.\s*/i, '')
          .trim()
      } else {
        parentDir = 'Бакалавриат'
        sectionTitle = sectionTitle.replace(/^\d+\.\s*/, '').trim()
      }

      const fileLinkElements = section.querySelectorAll('a[href$=".xlsx"]')

      if (fileLinkElements.length > 0) {
        fileLinkElements.forEach(async (fileLinkElement) => {
          const fileUrl = fileLinkElement.getAttribute('href')
          let fileName = `${fileLinkElement.text.trim()}.xlsx`
          let courseDir = ''

          // Определяем папку для курса
          const courseMatch = fileName.match(/(\d+)\s*курс/i)
          if (courseMatch) {
            courseDir = courseMatch[1] + ' курс'
            fileName = fileName.replace(/(\d+)\s*курс./i, '').trim() // Удаляем "X курс" из имени файла
          } else {
            courseDir = 'Прочее'
          }

          const fileDir = path.join(
            __dirname,
            'docs',
            'XLSXFiles',
            parentDir,
            sectionTitle,
            courseDir,
          )
          const filePath = path.join(fileDir, fileName)

          if (!fs.existsSync(fileDir)) {
            fs.mkdirSync(fileDir, { recursive: true })
          }

          const fileResponse = await axios({
            method: 'get',
            url: fileUrl,
            responseType: 'stream',
          })

          const writer = fs.createWriteStream(filePath)
          fileResponse.data.pipe(writer)

          writer.on('finish', () => {
            console.log(
              `Файл ${fileName} успешно загружен в папку ${path.join(parentDir, sectionTitle, courseDir)}.`,
            )
          })

          writer.on('error', (err) => {
            console.error(`Ошибка при сохранении файла ${fileName}:`, err)
          })
        })
      } else {
        console.error(`Ссылки на файлы не найдены в разделе "${sectionTitle}".`)
      }
    }
  })
} catch (error) {
  console.error('Ошибка при загрузке файлов:', error)
}
