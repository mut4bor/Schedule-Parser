import express from 'express'
import {
  getAllGroups,
  getGroupById,
  getGroupByName,
  getGroupNames,
  createGroup,
  updateGroupById,
  deleteGroupById,
  deleteAllGroups,
} from '../controllers/group.controller.js'
const groupRouter = express.Router()

groupRouter.get('/groups/', getAllGroups)
groupRouter.get('/groups/:id', getGroupById)
groupRouter.get('/names/:name', getGroupByName)
groupRouter.get('/names/', getGroupNames)
groupRouter.post('/groups/', createGroup)
groupRouter.put('/groups/:id', updateGroupById)
groupRouter.delete('/groups/:id', deleteGroupById)
groupRouter.delete('/groups/', deleteAllGroups)

export { groupRouter }
