import express from 'express'
import { getFaculties } from '../controllers/faculties.controller.js'
import { getCourses } from '../controllers/courses.controller.js'
import {
  getAllGroups,
  getGroupById,
  getWeeksByID,
  getWeekScheduleByID,
  createGroup,
  updateGroupById,
  deleteGroupById,
  deleteAllGroups,
} from '../controllers/group.controller.js'
import { getGroupNames, getGroupNamesThatMatchWithReqParams } from '../controllers/name.controller.js'

import { useEnv } from '../../hooks/useEnv.js'

useEnv()

const router = express.Router()

const checkPassword = (req, res, next) => {
  const password = req.headers['x-admin-password']

  if (password === process.env.X_ADMIN_PASSWORD) {
    next()
  } else {
    res.status(401).json({ message: 'Unauthorized: Incorrect password' })
  }
}

const groupsPath = `/groups`
const namesPath = `/names`
const facultyPath = `/faculty`
const coursePath = `/course`

router.use(groupsPath, checkPassword)
router.use(namesPath, checkPassword)
router.use(facultyPath, checkPassword)
router.use(coursePath, checkPassword)

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

export { router }
