import { deleteAllGroups } from '@/database/scripts/deleteAllGroups.js'
import { downloadSchedules } from '@/database/scripts/downloadSchedules.js'
import { createGroups } from '@/database/scripts/createGroups.js'

const createNPM = async () => {
  try {
    console.log('Удаление всех групп...')
    await deleteAllGroups()
    console.log('Загрузка расписаний...')
    await downloadSchedules()
    console.log('Создание групп...')
    await createGroups()
    console.log('Все операции выполнены успешно.')
  } catch (error) {
    console.error('Произошла ошибка:', error)
  }
}

createNPM()
