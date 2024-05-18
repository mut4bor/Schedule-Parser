import express from 'express'
import {
  getAllGroups,
  getGroupById,
  createGroup,
  updateGroupById,
  deleteGroupById,
  deleteAllGroups
} from '../controllers/group.controller.js'
const groupRouter = express.Router()

groupRouter.get('/', getAllGroups)
groupRouter.get('/:id', getGroupById)
groupRouter.post('/', createGroup)
groupRouter.put('/:id', updateGroupById)
groupRouter.delete('/:id', deleteGroupById)
groupRouter.delete('/', deleteAllGroups)

export { groupRouter }
