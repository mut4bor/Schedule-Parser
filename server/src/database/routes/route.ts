import { Router } from 'express'
import { authMiddleware, requireRole } from '@/middleware/authMiddleware.js'
import { login, register, refresh, logout } from '@/database/controllers/auth.controller.js'
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
import {
  getAllTeachers,
  createTeacher,
  updateTeacher,
  deleteTeacher,
  getTeacherById,
  getTeachersSchedules,
  getTeacherScheduleBySlot,
} from '@/database/controllers/teacher.controller.js'
import {
  getAllClassrooms,
  getClassroomById,
  getClassroomsSchedules,
  createClassroom,
  updateClassroom,
  deleteClassroom,
} from '@/database/controllers/classroom.controller.js'
import {
  listAllUsers,
  approveUser,
  changeUserRole,
  listPendingUsers,
  rejectUser,
} from '@/database/controllers/admin.controller.js'

// --- Router ---
const router = Router()

const adminPath = `/admin`
const educationTypePath = `/education-types`
const facultyPath = `/faculty`
const coursePath = `/course`
const groupsPath = `/groups`
const namesPath = `/names`
const teachersPath = `/teachers`
const schedulesPath = `/schedules`
const classroomsPath = `/classrooms`

// --- Авторизация ---
router.post('/register', register)
router.post('/login', login)
router.post('/refresh', refresh)
router.post('/logout', logout)

// --- Типы образования ---
router.get(educationTypePath, getEducationTypes)
router.post(educationTypePath, authMiddleware, requireRole('admin'), createEducationType)
router.put(`${educationTypePath}/:id`, authMiddleware, requireRole('admin'), updateEducationType)
router.delete(`${educationTypePath}/:id`, authMiddleware, requireRole('admin'), deleteEducationType)

// --- Факультеты ---
router.get(facultyPath, getFaculties)
router.post(facultyPath, authMiddleware, requireRole('admin'), createFaculty)
router.put(`${facultyPath}/:id`, authMiddleware, requireRole('admin'), updateFaculty)
router.delete(`${facultyPath}/:id`, authMiddleware, requireRole('admin'), deleteFaculty)

// --- Курсы ---
router.get(coursePath, getCourses)
router.post(coursePath, authMiddleware, requireRole('admin'), createCourse)
router.put(`${coursePath}/:id`, authMiddleware, requireRole('admin'), updateCourse)
router.delete(`${coursePath}/:id`, authMiddleware, requireRole('admin'), deleteCourse)

// --- Группы ---
router.get(groupsPath, getAllGroups)
router.get(`${groupsPath}/:id`, getGroupById)
router.post(groupsPath, authMiddleware, requireRole('admin'), createGroup)
router.put(`${groupsPath}/:id`, authMiddleware, requireRole('admin'), updateGroupById)
router.delete(`${groupsPath}/:id`, authMiddleware, requireRole('admin'), deleteGroupById)

// --- Расписание групп ---
router.get(`${groupsPath}/:id/weeks`, getWeeksByGroupId)
router.get(`${groupsPath}/:ids/schedule`, getGroupsSchedules)

// --- Управление расписанием ---
router.post(`${schedulesPath}/weeks`, authMiddleware, requireRole('admin'), createWeekSchedule)
router.put(`${schedulesPath}/weeks/:id`, authMiddleware, requireRole('admin'), updateWeekSchedule)
router.delete(`${schedulesPath}/weeks/:id`, authMiddleware, requireRole('admin'), deleteWeekSchedule)
router.get(`${schedulesPath}/:scheduleID`, getScheduleById)
router.post(schedulesPath, authMiddleware, requireRole('admin'), createLesson)
router.put(
  `${schedulesPath}/:scheduleID/days/:dayIndex/lessons/:lessonIndex`,
  authMiddleware,
  requireRole('admin'),
  updateLesson,
)
router.delete(
  `${schedulesPath}/:scheduleID/days/:dayIndex/lessons/:lessonIndex`,
  authMiddleware,
  requireRole('admin'),
  deleteLesson,
)

// --- Названия групп ---
router.get(namesPath, getGroupNames)
router.get(`${namesPath}/search`, getGroupNamesThatMatchWithReqParams)

// --- Преподаватели ---
router.get(teachersPath, getAllTeachers)
router.get(`${teachersPath}/:id`, getTeacherById)
router.post(teachersPath, authMiddleware, requireRole('admin'), createTeacher)
router.put(`${teachersPath}/:id`, authMiddleware, requireRole('admin'), updateTeacher)
router.delete(`${teachersPath}/:id`, authMiddleware, requireRole('admin'), deleteTeacher)
router.get(`${teachersPath}/:ids/schedules`, getTeachersSchedules)
router.get(`${teachersPath}/:id/schedule-slot`, getTeacherScheduleBySlot)

// --- Аудитории ---
router.get(classroomsPath, getAllClassrooms)
router.get(`${classroomsPath}/:id`, getClassroomById)
router.post(classroomsPath, authMiddleware, requireRole('admin'), createClassroom)
router.put(`${classroomsPath}/:id`, authMiddleware, requireRole('admin'), updateClassroom)
router.delete(`${classroomsPath}/:id`, authMiddleware, requireRole('admin'), deleteClassroom)
router.get(`${classroomsPath}/:ids/schedules`, getClassroomsSchedules)

// --- Админ ---
router.get(`${adminPath}/users`, authMiddleware, requireRole('superadmin'), listAllUsers)
router.get(`${adminPath}/users/pending`, authMiddleware, requireRole('superadmin'), listPendingUsers)
router.patch(`${adminPath}/users/:id/approve`, authMiddleware, requireRole('superadmin'), approveUser)
router.delete(`${adminPath}/users/:id/reject`, authMiddleware, requireRole('superadmin'), rejectUser)
router.patch(`${adminPath}/users/:id/role`, authMiddleware, requireRole('superadmin'), changeUserRole)

export { router }
