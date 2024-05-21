import express from 'express'
import {
  getAllGroups,
  getGroupById,
  createGroup,
  updateGroupById,
  deleteGroupById,
  deleteAllGroups,
} from '../controllers/group.controller.js'
import { getGroupByName, getGroupNames } from '../controllers/name.controller.js'
import { useEnv } from '../../hooks/useEnv.js'
useEnv()

const groupRouter = express.Router()

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

groupRouter.get(groupsPath, checkPassword, getAllGroups)
groupRouter.get(`${groupsPath}/:id`, checkPassword, getGroupById)
groupRouter.post(groupsPath, checkPassword, createGroup)
groupRouter.put(`${groupsPath}/:id`, checkPassword, updateGroupById)
groupRouter.delete(groupsPath, checkPassword, deleteAllGroups)
groupRouter.delete(`${groupsPath}/:id`, checkPassword, deleteGroupById)

groupRouter.get(namesPath, checkPassword, getGroupNames)
groupRouter.get(`${namesPath}/:name`, checkPassword, getGroupByName)

export { groupRouter }
