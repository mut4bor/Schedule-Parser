import { Request, Response } from 'express'
import { User } from '@/database/models/user.model.js'

const listAllUsers = async (_req: Request, res: Response) => {
  try {
    const users = await User.find().select('username role isApproved createdAt')
    return res.json(users)
  } catch (error) {
    res.status(500).json({
      message: error instanceof Error ? error.message : 'Неизвестная ошибка',
    })
  }
}

const listPendingUsers = async (_req: Request, res: Response) => {
  try {
    const users = await User.find({ isApproved: false }).select('username role createdAt')

    return res.json(users)
  } catch (error) {
    res.status(500).json({
      message: error instanceof Error ? error.message : 'Неизвестная ошибка',
    })
  }
}

const approveUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params

    const user = await User.findByIdAndUpdate(id, { isApproved: true }, { new: true }).select(
      'username role isApproved',
    )

    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    return res.json({ message: 'Approved', user })
  } catch (error) {
    res.status(500).json({
      message: error instanceof Error ? error.message : 'Неизвестная ошибка',
    })
  }
}

const rejectUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params

    const user = await User.findByIdAndDelete(id)

    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    return res.json({ message: 'Rejected and deleted' })
  } catch (error) {
    res.status(500).json({
      message: error instanceof Error ? error.message : 'Неизвестная ошибка',
    })
  }
}

const changeUserRole = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const { role } = req.body

    if (!['admin'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' })
    }

    const user = await User.findByIdAndUpdate(id, { role }, { new: true }).select('username role')

    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    return res.json({ message: 'Role updated', user })
  } catch (error) {
    res.status(500).json({
      message: error instanceof Error ? error.message : 'Неизвестная ошибка',
    })
  }
}

export { listAllUsers, listPendingUsers, approveUser, rejectUser, changeUserRole }
