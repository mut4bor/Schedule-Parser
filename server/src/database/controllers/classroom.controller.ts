import { Request, Response } from 'express'
import { Classroom } from '@/database/models/classroom.model.js'

const getAllClassrooms = async (req: Request, res: Response) => {
  try {
    const classrooms = await Classroom.find().lean()
    res.status(200).json(classrooms)
  } catch (error) {
    res.status(500).json({
      message: error instanceof Error ? error.message : 'Неизвестная ошибка',
    })
  }
}

const getClassroomById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const classroom = await Classroom.findById(id)
    if (!classroom) {
      return res.status(404).json({ message: 'Аудитория не найдена' })
    }
    res.status(200).json(classroom)
  } catch (error: any) {
    res.status(500).json({
      message: error instanceof Error ? error.message : 'Неизвестная ошибка',
    })
  }
}

const createClassroom = async (req: Request, res: Response) => {
  try {
    const { name, capacity, description } = req.body

    if (!name || !capacity) {
      return res.status(400).json({
        message: 'name и capacity обязательны',
      })
    }

    const exists = await Classroom.findOne({ name }).lean()
    if (exists) {
      return res.status(409).json({ message: 'Аудитория с таким именем уже есть' })
    }

    const created = await Classroom.create({
      name,
      capacity,
      description,
    })

    res.status(201).json(created)
  } catch (error) {
    res.status(500).json({
      message: error instanceof Error ? error.message : 'Неизвестная ошибка',
    })
  }
}

const updateClassroom = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const { name, capacity, description } = req.body

    const classroom = await Classroom.findById(id)
    if (!classroom) {
      return res.status(404).json({ message: 'Аудитория не найдена' })
    }

    if (name && name !== classroom.name) {
      const exists = await Classroom.findOne({ name }).lean()
      if (exists) {
        return res.status(409).json({
          message: 'Аудитория с таким именем уже есть',
        })
      }
    }

    classroom.name = name ?? classroom.name
    classroom.capacity = capacity ?? classroom.capacity
    classroom.description = description ?? classroom.description

    await classroom.save()

    res.status(200).json(classroom)
  } catch (error) {
    res.status(500).json({
      message: error instanceof Error ? error.message : 'Неизвестная ошибка',
    })
  }
}

const deleteClassroom = async (req: Request, res: Response) => {
  try {
    const { id } = req.params

    const classroom = await Classroom.findById(id)
    if (!classroom) {
      return res.status(404).json({ message: 'Аудитория не найдена' })
    }

    await classroom.deleteOne()
    res.status(200).json({ success: true })
  } catch (error) {
    res.status(500).json({
      message: error instanceof Error ? error.message : 'Неизвестная ошибка',
    })
  }
}

export { getAllClassrooms, getClassroomById, createClassroom, updateClassroom, deleteClassroom }
