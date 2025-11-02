import { Request, Response } from 'express'
import { Teacher } from '@/database/models/teacher.model.js'

const getAllTeachers = async (_req: Request, res: Response) => {
  try {
    const teachers = await Teacher.find().sort({ createdAt: -1 })
    res.status(200).json(teachers)
  } catch (error: any) {
    res.status(500).json({
      message: error instanceof Error ? error.message : 'Неизвестная ошибка',
    })
  }
}

const getTeacherById = async (req: Request, res: Response) => {
  try {
    const teacher = await Teacher.findById(req.params.id)
    if (!teacher) {
      return res.status(404).json({ message: 'Преподаватель не найден' })
    }
    res.status(200).json(teacher)
  } catch (error: any) {
    res.status(500).json({
      message: error instanceof Error ? error.message : 'Неизвестная ошибка',
    })
  }
}

const createTeacher = async (req: Request, res: Response) => {
  try {
    const { firstName, middleName, lastName, title } = req.body

    await Teacher.create({
      firstName,
      middleName,
      lastName,
      title,
    })

    res.status(201).json({ message: 'Преподаватель успешно создан' })
  } catch (error: any) {
    res.status(500).json({
      message: error instanceof Error ? error.message : 'Неизвестная ошибка',
    })
  }
}

const updateTeacher = async (req: Request, res: Response) => {
  try {
    const { firstName, middleName, lastName, title } = req.body

    const teacher = await Teacher.findByIdAndUpdate(
      req.params.id,
      { firstName, middleName, lastName, title },
      { new: true, runValidators: true },
    )

    if (!teacher) {
      return res.status(404).json({ message: 'Преподаватель не найден' })
    }

    res.status(200).json({ message: 'Преподаватель успешно обновлен' })
  } catch (error: any) {
    res.status(500).json({
      message: error instanceof Error ? error.message : 'Неизвестная ошибка',
    })
  }
}

const deleteTeacher = async (req: Request, res: Response) => {
  try {
    const teacher = await Teacher.findByIdAndDelete(req.params.id)

    if (!teacher) {
      return res.status(404).json({ message: 'Преподаватель не найден' })
    }

    res.status(200).json({ message: 'Преподаватель успешно удален' })
  } catch (error: any) {
    res.status(500).json({
      message: error instanceof Error ? error.message : 'Неизвестная ошибка',
    })
  }
}

export { getAllTeachers, getTeacherById, createTeacher, updateTeacher, deleteTeacher }
