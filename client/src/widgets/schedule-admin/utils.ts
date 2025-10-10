import { IGroup } from '@/shared/redux/types'
import { Combination } from './types'

export const dayNames = ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота']

export const collectAllCombinations = (groupsData: IGroup[]): Combination[] => {
  const combinations: Combination[] = []

  groupsData.forEach((group) => {
    Object.entries(group.dates).forEach(([weekName, week]) => {
      week.forEach((dayLessons, dayIndex) => {
        dayLessons.forEach((lesson) => {
          const exists = combinations.some(
            (c) => c.dayIndex === dayIndex && c.weekName === weekName && c.time === lesson.time,
          )
          if (!exists) {
            combinations.push({ dayIndex, weekName, time: lesson.time })
          }
        })
      })
    })
  })

  const weekPriority = (weekName: string): number => {
    if (weekName === 'odd') return 0
    if (weekName === 'even') return 1
    return 2
  }

  const compareWeekNames = (a: string, b: string): number => {
    const pa = weekPriority(a)
    const pb = weekPriority(b)
    if (pa !== pb) return pa - pb

    if (pa === 2) {
      return a.localeCompare(b)
    }

    return 0
  }

  return combinations.sort((a, b) => {
    if (a.dayIndex !== b.dayIndex) return a.dayIndex - b.dayIndex
    if (a.time !== b.time) return a.time.localeCompare(b.time)
    return compareWeekNames(a.weekName, b.weekName)
  })
}
