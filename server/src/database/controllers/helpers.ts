import { IDay, ILesson, ISchedule, IWeek } from '@/types/index.js'

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

const datesMap: ISchedule = new Map([
  ['odd', createWeekPlaceholder()],
  ['even', createWeekPlaceholder()],
])

export { datesMap, lessonTimes, lessonPlaceholder, createDayPlaceholder, createWeekPlaceholder }
