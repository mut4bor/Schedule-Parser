import { Router, Request, Response, NextFunction } from 'express'
import { NODE_ENV, PRODUCTION_DOMAIN, X_ADMIN_PASSWORD } from '@/config/index.js'
import {
  getAllGroups,
  getGroupById,
  createGroup,
  updateGroupById,
  deleteGroupById,
  addWeekNameToGroup,
  updateWeekNameInGroup,
  deleteWeekNameFromGroup,
  getWeeksByID,
  getWeekScheduleByID,
  deleteLessonFromDay,
  updateLessonInDay,
} from '@/database/controllers/group.controller.js'

import {
  getCourses,
  createCourse,
  updateCourse,
  deleteCourse,
  getGroupsByCourse,
} from '@/database/controllers/courses.controller.js'

import {
  getFaculties,
  createFaculty,
  updateFaculty,
  deleteFaculty,
  getGroupsByFaculty,
  getAllFaculties,
} from '@/database/controllers/faculties.controller.js'

import {
  getEducationTypes,
  createEducationType,
  updateEducationType,
  deleteEducationType,
  getGroupsByEducationType,
} from '@/database/controllers/educationTypes.controller.js'
import { getGroupNames, getGroupNamesThatMatchWithReqParams } from '@/database/controllers/name.controller.js'
import { refreshSchedule } from '@/database/controllers/refresh.controller.js'

const router = Router()

// Middleware для проверки пароля
const checkPassword = (req: Request, res: Response, next: NextFunction) => {
  const password = req.headers['x-admin-password']

  if (password === X_ADMIN_PASSWORD) {
    next()
  } else {
    res.status(401).json({ message: 'Unauthorized: Incorrect password' })
  }
}

// Префиксы путей
const groupsPath = `/groups`
const namesPath = `/names`
const facultyPath = `/faculty`
const coursePath = `/course`
const refreshPath = `/refresh`
const educationTypePath = `/education-types` // Новый путь

// Middleware для всех маршрутов, кроме GET, использующих проверку пароля
router.use((req, res, next) => {
  // const requestOrigin = req.get('origin')
  // if (NODE_ENV === 'production' && (!requestOrigin || requestOrigin !== PRODUCTION_DOMAIN)) {
  //   return res.status(401).json({ message: 'Unauthorized: Incorrect domain' })
  // }

  if (req.method !== 'GET' && req.path !== refreshPath) {
    // refreshPath уже имеет свою проверку
    return checkPassword(req, res, next)
  }
  next()
})

// --- Типы образования ---
router.get(educationTypePath, getEducationTypes)
router.post(educationTypePath, createEducationType) // Создать новый тип образования (по сути, новую группу)
router.put(educationTypePath, updateEducationType) // Обновить название типа образования
router.delete(`${educationTypePath}/:educationType`, deleteEducationType) // Удалить тип образования
router.get(`${educationTypePath}/:educationType/groups`, getGroupsByEducationType) // Получить группы по типу образования

// --- Факультеты ---
router.get(facultyPath, getFaculties) // Ваш существующий метод с разделением по educationType
router.get(`${facultyPath}/all`, getAllFaculties) // Новый метод, чтобы получить список всех уникальных факультетов
router.post(facultyPath, createFaculty) // Создать новый факультет (по сути, новую группу с указанным факультетом)
router.put(facultyPath, updateFaculty) // Обновить название факультета
router.delete(`${facultyPath}/:educationType/:faculty`, deleteFaculty) // Удалить факультет (все группы с этим факультетом)
router.get(`${facultyPath}/:faculty/groups`, getGroupsByFaculty) // Получить группы по факультету

// --- Курсы ---
router.get(coursePath, getCourses)
router.post(coursePath, createCourse) // Создать новый курс (по сути, новую группу с указанным курсом)
router.put(coursePath, updateCourse) // Обновить номер курса
router.delete(`${coursePath}/:educationType/:faculty/:course`, deleteCourse) // Удалить курс (все группы с этим курсом)
router.get(`${coursePath}/:course/groups`, getGroupsByCourse) // Получить группы по курсу

// --- Группы ---
router.get(groupsPath, getAllGroups)
router.get(`${groupsPath}/:id`, getGroupById)
router.get(`${groupsPath}/:id/weeks`, getWeeksByID)
router.get(`${groupsPath}/:id/weeks/:week`, getWeekScheduleByID)
router.post(groupsPath, createGroup)
router.put(`${groupsPath}/:id`, updateGroupById)
router.delete(`${groupsPath}/:id`, deleteGroupById)

// --- Управление расписанием для групп (требует пароль) ---
router.post(`${groupsPath}/:id/weeks`, addWeekNameToGroup)
router.put(`${groupsPath}/:id/weeks`, updateWeekNameInGroup)
router.delete(`${groupsPath}/:id/weeks/:weekName`, deleteWeekNameFromGroup)
router.put(`${groupsPath}/:id/weeks/:weekName/days/:day/times/:time`, updateLessonInDay)
router.delete(`${groupsPath}/:id/weeks/:weekName/days/:day/times/:time`, deleteLessonFromDay)

// --- Названия групп ---
router.get(namesPath, getGroupNames)
router.get(`${namesPath}/search`, getGroupNamesThatMatchWithReqParams)

// --- Обновление данных из внешних источников (требует пароль через req.body) ---
router.post(refreshPath, refreshSchedule)

export { router }
