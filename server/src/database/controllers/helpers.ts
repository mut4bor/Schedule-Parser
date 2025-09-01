import { IDay, ILesson, ISchedule, IWeek } from '@/types/index.js'

function getWeekNumber(date: Date): { year: number; week: number } {
  const tmp = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
  const dayNum = tmp.getUTCDay() || 7
  tmp.setUTCDate(tmp.getUTCDate() + 4 - dayNum)
  const yearStart = new Date(Date.UTC(tmp.getUTCFullYear(), 0, 1))
  const weekNo = Math.ceil(((+tmp - +yearStart) / 86400000 + 1) / 7)
  return { year: tmp.getUTCFullYear(), week: weekNo }
}

const { year, week } = getWeekNumber(new Date())
const weekKey: string = `${year}-W${String(week).padStart(2, '0')}`

const lessonPlaceholder: Omit<ILesson, 'time'> = {
  classroom: '',
  teacher: {
    firstName: '',
    middleName: '',
    lastName: '',
  },
  subject: '',
  lessonType: '',
}

const lessonTimes = ['09:45', '11:30', '13:30', '15:15', '17:00']

function createDayPlaceholder(): IDay {
  return lessonTimes.map(
    (time): ILesson => ({
      ...lessonPlaceholder,
      time,
    }),
  )
}

function createWeekPlaceholder(): IWeek {
  return Array.from({ length: 6 }, () => createDayPlaceholder())
}

const datesMap: ISchedule = new Map([[weekKey, createWeekPlaceholder()]])

export { datesMap, lessonTimes, lessonPlaceholder, createDayPlaceholder, createWeekPlaceholder }
