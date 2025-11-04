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

import { getCourses, createCourse, updateCourse, deleteCourse } from '@/database/controllers/courses.controller.js'

import {
  getFaculties,
  createFaculty,
  updateFaculty,
  deleteFaculty,
} from '@/database/controllers/faculties.controller.js'

import {
  getEducationTypes,
  createEducationType,
  updateEducationType,
  deleteEducationType,
} from '@/database/controllers/educationTypes.controller.js'
import { getGroupNames, getGroupNamesThatMatchWithReqParams } from '@/database/controllers/name.controller.js'
import { authMiddleware } from '@/middleware/authMiddleware.js'
import { login, refresh, logout } from '../controllers/auth.controller.js'
import {
  getAllTeachers,
  createTeacher,
  updateTeacher,
  deleteTeacher,
  getTeacherById,
} from '../controllers/teacher.controller.js'

// --- Router ---
const router = Router()

const educationTypePath = `/education-types`
const facultyPath = `/faculty`
const coursePath = `/course`
const groupsPath = `/groups`
const namesPath = `/names`
const teachersPath = `/teachers`

// --- Авторизация ---
router.post('/login', login)
router.post('/logout', logout)
router.post('/refresh', refresh)

router.use(authMiddleware)

// --- Типы образования ---
router.get(educationTypePath, getEducationTypes)
router.post(educationTypePath, createEducationType)
router.put(`${educationTypePath}/:id`, updateEducationType)
router.delete(`${educationTypePath}/:id`, deleteEducationType)

// --- Факультеты ---
router.get(facultyPath, getFaculties)
router.post(facultyPath, createFaculty)
router.put(`${facultyPath}/:id`, updateFaculty)
router.delete(`${facultyPath}/:id`, deleteFaculty)

// --- Курсы ---
router.get(coursePath, getCourses)
router.post(coursePath, createCourse)
router.put(`${coursePath}/:id`, updateCourse)
router.delete(`${coursePath}/:id`, deleteCourse)

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

// --- Преподаватели ---
router.get(teachersPath, getAllTeachers)
router.get(`${teachersPath}/:id`, getTeacherById)
router.post(teachersPath, createTeacher)
router.put(`${teachersPath}/:id`, updateTeacher)
router.delete(`${teachersPath}/:id`, deleteTeacher)

export { router }
