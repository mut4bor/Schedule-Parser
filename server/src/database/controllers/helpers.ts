import { IDay, ISchedule } from '@/types/index.js'

// Функция для получения номера недели (ISO-8601)
function getWeekNumber(date: Date): { year: number; week: number } {
  const tmp = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
  const dayNum = tmp.getUTCDay() || 7
  tmp.setUTCDate(tmp.getUTCDate() + 4 - dayNum)
  const yearStart = new Date(Date.UTC(tmp.getUTCFullYear(), 0, 1))
  const weekNo = Math.ceil(((+tmp - +yearStart) / 86400000 + 1) / 7)
  return { year: tmp.getUTCFullYear(), week: weekNo }
}

// Функция для получения массива дат текущей недели
function getCurrentWeekDates(): string[] {
  const today = new Date()
  const day = today.getDay() // 0 - воскресенье, 1 - понедельник, ...
  const diffToMonday = day === 0 ? -6 : 1 - day // смещение до понедельника

  const monday = new Date(today)
  monday.setDate(today.getDate() + diffToMonday)

  const week: string[] = []
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday)
    d.setDate(monday.getDate() + i)
    week.push(d.toISOString().split('T')[0]) // формат YYYY-MM-DD
  }

  return week
}

const weekDates = getCurrentWeekDates()
const { year, week } = getWeekNumber(new Date())
const weekKey: string = `${year}-W${String(week).padStart(2, '0')}`

const lessonPlaceholder = {
  classroom: '',
  teacher: { firstName: '', lastName: '' },
  subject: '',
  lessonType: '',
}

const lessonTimes = ['09:45', '11:30', '13:30', '15:15', '17:00']

function createDayPlaceholder(): IDay {
  return lessonTimes.reduce((acc, time) => {
    acc[time] = { ...lessonPlaceholder }
    return acc
  }, {} as IDay)
}

const datesMap: ISchedule = new Map()

datesMap.set(
  weekKey,
  weekDates.map(() => createDayPlaceholder()),
)

export { datesMap, lessonTimes, lessonPlaceholder }
