import express from 'express'
import {
  getAllGroups,
  getGroupById,
  createGroup,
  updateGroupById,
  deleteGroupById,
  deleteAllGroups,
} from '../controllers/group.controller.js'
import {
  getGroupByName,
  getGroupNames,
} from '../controllers/name.controller.js'
import {
  getUniqueEducationTypes,
  getUniqueFaculties,
  getUniqueCourses,
} from '../controllers/distinctData.controller.js'
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
const educationTypePath = `/educationType`

router.use(groupsPath, checkPassword)
router.use(namesPath, checkPassword)
router.use(educationTypePath, checkPassword)

router.get(groupsPath, getAllGroups)
router.get(`${groupsPath}/:id`, getGroupById)
router.post(groupsPath, createGroup)
router.put(`${groupsPath}/:id`, updateGroupById)
router.delete(groupsPath, deleteAllGroups)
router.delete(`${groupsPath}/:id`, deleteGroupById)

router.get(namesPath, getGroupNames)
router.get(`${namesPath}/:name`, getGroupByName)

router.get(educationTypePath, getUniqueEducationTypes)
router.get(`${educationTypePath}/faculty`, getUniqueFaculties)
router.get(`${educationTypePath}/faculty/course`, getUniqueCourses)

export { router }
