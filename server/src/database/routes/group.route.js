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
const groupRouter = express.Router()

groupRouter.get('/groups', getAllGroups)
groupRouter.get('/groups/:id', getGroupById)
groupRouter.post('/groups', createGroup)
groupRouter.put('/groups/:id', updateGroupById)
groupRouter.delete('/groups', deleteAllGroups)
groupRouter.delete('/groups/:id', deleteGroupById)

groupRouter.get('/names', getGroupNames)
groupRouter.get('/names/:name', getGroupByName)

export { groupRouter }
