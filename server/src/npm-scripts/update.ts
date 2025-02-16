import { downloadSchedules } from '@/database/scripts/downloadSchedules'
import { updateGroups } from '@/database/scripts/updateGroups'

const createNPM = async () => {
  try {
    console.log('Загрузка расписаний...')
    await downloadSchedules()
    console.log('Обновление групп...')
    await updateGroups()
    console.log('Все операции выполнены успешно.')
  } catch (error) {
    console.error('Произошла ошибка:', error)
  }
}

createNPM()
