/**
 * Перечисление для дней недели.
 */
enum DayOfWeek {
  MONDAY = 'Понедельник',
  TUESDAY = 'Вторник',
  WEDNESDAY = 'Среда',
  THURSDAY = 'Четверг',
  FRIDAY = 'Пятница',
  SATURDAY = 'Суббота',
  SUNDAY = 'Воскресенье',
}

enum DayOfWeekIndex {
  MONDAY = 1,
  TUESDAY = 2,
  WEDNESDAY = 3,
  THURSDAY = 4,
  FRIDAY = 5,
  SATURDAY = 6,
  SUNDAY = 7,
}

/**
 * Интерфейс для представления временного слота (например, 09:00 - 10:30).
 */
interface TimeSlot {
  startTime: string // Например, "09:00"
  endTime: string // Например, "10:30"
}

/**
 * Интерфейс для представления аудитории.
 */
interface Classroom {
  name: string // Например, "Ауд. 205"
}

/**
 * Интерфейс для представления преподавателя.
 */
interface Teacher {
  id: string // Уникальный идентификатор преподавателя
  fullName: string // Например, "Иванов И.И."
}

/**
 * Интерфейс для представления учебной дисциплины (предмета).
 */
interface Subject {
  name: string // Например, "Математический анализ"
}

/**
 * Интерфейс для одного занятия в расписании.
 */
interface Class {
  subject: Subject
  type: string
  time: TimeSlot
  classroom: Classroom
  teacher: Teacher
  notes?: string // Дополнительные примечания к занятию, опционально
}

/**
 * Интерфейс для расписания на один день.
 */
interface DailySchedule {
  day: string // DD-MM
  dayOfWeek: DayOfWeek
  dayOfWeekIndex: DayOfWeekIndex
  classes: Class[]
}

/**
 * Интерфейс для расписания на конкретную неделю.
 * Каждая запись соответствует расписанию для определенной недели.
 */
interface WeeklySchedule {
  startDate: string // Дата начала этой недели (DD-MM-YYYY)
  endDate: string // Дата окончания этой недели (DD-MM-YYYY)
  days: DailySchedule[] // Расписание на каждый день этой конкретной недели
  isActive: boolean
}

interface EducationType {
  id: string
  name: string
}

interface Faculty {
  id: string
  name: string
}

/**
 * Интерфейс для расписания одной группы университета
 * с явной понедельной группировкой по датам.
 */
interface GroupSchedule {
  id: string // Уникальный идентификатор группы
  groupName: string // Например, "ИВТ-201"
  educationType: EducationType
  faculty: Faculty
  course: number // Курс, например, 2
  weeklySchedules: WeeklySchedule[] // Массив расписаний для каждой конкретной недели семестра
}
