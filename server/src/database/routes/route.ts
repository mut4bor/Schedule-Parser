import { Router, Request, Response, NextFunction } from 'express'
import { NODE_ENV, PRODUCTION_DOMAIN, X_ADMIN_PASSWORD } from '@/config'
import { getCourses } from '@/database/controllers/courses.controller'
import { getFaculties } from '@/database/controllers/faculties.controller'
import {
  getAllGroups,
  getGroupById,
  getWeeksByID,
  getWeekScheduleByID,
  createGroup,
  updateGroupById,
  deleteGroupById,
  deleteAllGroups,
} from '@/database/controllers/group.controller'
import { getGroupNames, getGroupNamesThatMatchWithReqParams } from '@/database/controllers/name.controller'
import { refreshSchedule } from '@/database/controllers/refresh.controller'

const router = Router()

const checkPassword = (req: Request, res: Response, next: NextFunction) => {
  const password = req.headers['x-admin-password']

  if (password === X_ADMIN_PASSWORD) {
    next()
  } else {
    res.status(401).json({ message: 'Unauthorized: Incorrect password' })
  }
}

const groupsPath = `/groups`
const namesPath = `/names`
const facultyPath = `/faculty`
const coursePath = `/course`
const refreshPath = `/refresh`

router.use((req, res, next) => {
  // const requestOrigin = req.get('origin')

  // if (NODE_ENV === 'production' && (!requestOrigin || requestOrigin !== PRODUCTION_DOMAIN)) {
  //   return res.status(401).json({ message: 'Unauthorized: Incorrect domain' })
  // }

  if (req.method !== 'GET') {
    return checkPassword(req, res, next)
  }
  next()
})

router.get(groupsPath, getAllGroups)
router.get(`${groupsPath}/:id`, getGroupById)
router.get(`${groupsPath}/:id/weeks`, getWeeksByID)
router.get(`${groupsPath}/:id/weeks/:week`, getWeekScheduleByID)
router.post(groupsPath, createGroup)
router.put(`${groupsPath}/:id`, updateGroupById)
router.delete(groupsPath, deleteAllGroups)
router.delete(`${groupsPath}/:id`, deleteGroupById)

router.get(namesPath, getGroupNames)
router.get(`${namesPath}/search`, getGroupNamesThatMatchWithReqParams)

router.get(facultyPath, getFaculties)
router.get(coursePath, getCourses)

router.post(refreshPath, refreshSchedule)

export { router }
