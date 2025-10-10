import { Router } from 'express'
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
  createLessonInDay,
  getGroupsSchedulesByID,
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
import { authMiddleware } from '@/middleware/authMiddleware.js'
import { login, refresh, logout } from '../controllers/auth.controller.js'

// --- Router ---
const router = Router()

const educationTypePath = `/education-types`
const facultyPath = `/faculty`
const coursePath = `/course`
const groupsPath = `/groups`
const namesPath = `/names`

// --- Авторизация ---
router.post('/login', login)
router.post('/logout', logout)
router.post('/refresh', refresh)

router.use(authMiddleware)

// --- Типы образования ---
router.get(educationTypePath, getEducationTypes)
router.post(educationTypePath, createEducationType)
router.put(educationTypePath, updateEducationType)
router.delete(`${educationTypePath}/:educationType`, deleteEducationType)
router.get(`${educationTypePath}/:educationType/groups`, getGroupsByEducationType)

// --- Факультеты ---
router.get(facultyPath, getFaculties)
router.get(`${facultyPath}/all`, getAllFaculties)
router.post(facultyPath, createFaculty)
router.put(facultyPath, updateFaculty)
router.delete(`${facultyPath}/:educationType/:faculty`, deleteFaculty)
router.get(`${facultyPath}/:faculty/groups`, getGroupsByFaculty)

// --- Курсы ---
router.get(coursePath, getCourses)
router.post(coursePath, createCourse)
router.put(coursePath, updateCourse)
router.delete(`${coursePath}/:educationType/:faculty/:course`, deleteCourse)
router.get(`${coursePath}/:course/groups`, getGroupsByCourse)

// --- Группы ---
router.get(groupsPath, getAllGroups)
router.get(`${groupsPath}/:id`, getGroupById)
router.get(`${groupsPath}/:id/weeks`, getWeeksByID)
router.get(`${groupsPath}/:id/weeks/:week`, getWeekScheduleByID)
router.get(`${groupsPath}/:ids/schedule`, getGroupsSchedulesByID)
router.post(groupsPath, createGroup)
router.put(`${groupsPath}/:id`, updateGroupById)
router.delete(`${groupsPath}/:id`, deleteGroupById)

// --- Управление расписанием для групп ---
router.post(`${groupsPath}/:id/weeks`, addWeekNameToGroup)
router.put(`${groupsPath}/:id/weeks`, updateWeekNameInGroup)
router.delete(`${groupsPath}/:id/weeks/:weekName`, deleteWeekNameFromGroup)

router.post(`${groupsPath}/:id/weeks/:weekName/days/:dayIndex/lessons`, createLessonInDay)
router.put(`${groupsPath}/:id/weeks/:weekName/days/:dayIndex/lessons/:lessonId`, updateLessonInDay)
router.delete(`${groupsPath}/:id/weeks/:weekName/days/:dayIndex/lessons/:lessonId`, deleteLessonFromDay)

// --- Названия групп ---
router.get(namesPath, getGroupNames)
router.get(`${namesPath}/search`, getGroupNamesThatMatchWithReqParams)

export { router }
