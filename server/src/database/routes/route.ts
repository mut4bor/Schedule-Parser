import { Router } from 'express'
import {
  getAllGroups,
  getGroupById,
  createGroup,
  updateGroupById,
  deleteGroupById,
} from '@/database/controllers/group.controller.js'
import {
  getScheduleById,
  createLesson,
  updateLesson,
  deleteLesson,
  getWeeksByGroupId,
  getGroupsSchedules,
  createWeekSchedule,
  updateWeekSchedule,
  deleteWeekSchedule,
} from '@/database/controllers/schedule.controller.js'
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
  getTeachersSchedules,
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
const schedulesPath = `/schedules`

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
router.get(`${groupsPath}/:ids/schedule`, getGroupsSchedules)

// --- Управление расписанием ---
router.post(`${schedulesPath}/weeks`, createWeekSchedule)
router.put(`${schedulesPath}/weeks/:id`, updateWeekSchedule)
router.delete(`${schedulesPath}/weeks/:id`, deleteWeekSchedule)
router.get(`${schedulesPath}/:scheduleID`, getScheduleById)
router.post(schedulesPath, createLesson)
router.put(`${schedulesPath}/:scheduleID/days/:dayIndex/lessons/:lessonIndex`, updateLesson)
router.delete(`${schedulesPath}/:scheduleID/days/:dayIndex/lessons/:lessonIndex`, deleteLesson)

// --- Названия групп ---
router.get(namesPath, getGroupNames)
router.get(`${namesPath}/search`, getGroupNamesThatMatchWithReqParams)

// --- Преподаватели ---
router.get(teachersPath, getAllTeachers)
router.get(`${teachersPath}/:id`, getTeacherById)
router.post(teachersPath, createTeacher)
router.put(`${teachersPath}/:id`, updateTeacher)
router.delete(`${teachersPath}/:id`, deleteTeacher)
router.get(`${teachersPath}/:ids/schedules`, getTeachersSchedules)

export { router }
