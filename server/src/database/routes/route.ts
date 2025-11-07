import { Router } from 'express'
import {
  getAllGroups,
  getGroupById,
  createGroup,
  updateGroupById,
  deleteGroupById,
} from '@/database/controllers/group.controller.js'
import {
  getWeeksByGroupId,
  getWeekScheduleByGroupId,
  getGroupsSchedules,
  checkWeekAvailability,
  updateWeekSchedule,
  deleteWeekSchedule,
} from '@/database/controllers/week.controller.js'
import { createLesson, updateLesson, deleteLesson } from '@/database/controllers/schedule.controller.js'
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
import { login, refresh, logout } from '@/database/controllers/auth.controller.js'
import {
  getAllTeachers,
  createTeacher,
  updateTeacher,
  deleteTeacher,
  getTeacherById,
} from '@/database/controllers/teacher.controller.js'
import { authMiddleware } from '@/middleware/authMiddleware.js'

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
router.post(groupsPath, createGroup)
router.put(`${groupsPath}/:id`, updateGroupById)
router.delete(`${groupsPath}/:id`, deleteGroupById)

// --- Расписание групп ---
router.get(`${groupsPath}/:id/weeks`, getWeeksByGroupId)
router.get(`${groupsPath}/:id/weeks/:week`, getWeekScheduleByGroupId)
router.get(`${groupsPath}/:ids/schedule`, getGroupsSchedules)

// --- Управление неделями ---
router.post(`${groupsPath}/:id/weeks`, checkWeekAvailability)
router.put(`${groupsPath}/:id/weeks`, updateWeekSchedule)
router.delete(`${groupsPath}/:id/weeks/:weekName`, deleteWeekSchedule)

// --- Управление уроками ---
router.post(`${groupsPath}/:id/weeks/:weekName/days/:dayIndex/lessons`, createLesson)
router.put(`${groupsPath}/lessons/:lessonId`, updateLesson)
router.delete(`${groupsPath}/lessons/:lessonId`, deleteLesson)

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
