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

router.get(groupsPath, checkPassword, getAllGroups)
router.get(`${groupsPath}/:id`, checkPassword, getGroupById)
router.post(groupsPath, checkPassword, createGroup)
router.put(`${groupsPath}/:id`, checkPassword, updateGroupById)
router.delete(groupsPath, checkPassword, deleteAllGroups)
router.delete(`${groupsPath}/:id`, checkPassword, deleteGroupById)

router.get(namesPath, checkPassword, getGroupNames)
router.get(`${namesPath}/:name`, checkPassword, getGroupByName)

export { router }
