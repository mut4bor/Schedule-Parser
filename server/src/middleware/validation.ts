// middleware/validation.ts
import { Request, Response, NextFunction } from 'express'

export const validateTeacher = (req: Request, res: Response, next: NextFunction) => {
  const { first_name, surname, patronymic } = req.body

  if (!first_name || typeof first_name !== 'string' || first_name.trim().length === 0) {
    return res.status(400).json({ error: 'First name is required and must be a non-empty string' })
  }

  if (first_name.length > 100) {
    return res.status(400).json({ error: 'First name must be less than 100 characters' })
  }

  if (!surname || typeof surname !== 'string' || surname.trim().length === 0) {
    return res.status(400).json({ error: 'Surname is required and must be a non-empty string' })
  }

  if (surname.length > 100) {
    return res.status(400).json({ error: 'Surname must be less than 100 characters' })
  }

  if (patronymic !== undefined && patronymic !== null) {
    if (typeof patronymic !== 'string') {
      return res.status(400).json({ error: 'Patronymic must be a string' })
    }
    if (patronymic.length > 100) {
      return res.status(400).json({ error: 'Patronymic must be less than 100 characters' })
    }
  }

  next()
}

export const validateGroup = (req: Request, res: Response, next: NextFunction) => {
  const { name, course, education_type_id } = req.body

  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    return res.status(400).json({ error: 'Group name is required' })
  }

  if (!course || !Number.isInteger(course) || course <= 0) {
    return res.status(400).json({ error: 'Course must be a positive integer' })
  }

  if (!education_type_id || !Number.isInteger(education_type_id)) {
    return res.status(400).json({ error: 'Education type ID must be an integer' })
  }

  next()
}

export const validateSchedule = (req: Request, res: Response, next: NextFunction) => {
  const { group_id, schedule_date, lessons } = req.body

  if (!group_id || !Number.isInteger(group_id)) {
    return res.status(400).json({ error: 'Group ID must be an integer' })
  }

  if (!schedule_date || !/^\d{4}-\d{2}-\d{2}$/.test(schedule_date)) {
    return res.status(400).json({ error: 'Schedule date must be in YYYY-MM-DD format' })
  }

  if (lessons && Array.isArray(lessons)) {
    for (const lesson of lessons) {
      if (!lesson.start_time || !/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(lesson.start_time)) {
        return res.status(400).json({ error: 'Start time must be in HH:MM format' })
      }

      if (!lesson.end_time || !/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(lesson.end_time)) {
        return res.status(400).json({ error: 'End time must be in HH:MM format' })
      }

      if (!lesson.subject_name || typeof lesson.subject_name !== 'string') {
        return res.status(400).json({ error: 'Subject name is required' })
      }

      if (!lesson.classroom || typeof lesson.classroom !== 'string') {
        return res.status(400).json({ error: 'Classroom is required' })
      }
    }
  }

  next()
}

export const validateAuth = (req: Request, res: Response, next: NextFunction) => {
  const { username, password } = req.body

  if (!username || typeof username !== 'string' || username.trim().length === 0) {
    return res.status(400).json({ error: 'Username is required' })
  }

  if (!password || typeof password !== 'string' || password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters long' })
  }

  next()
}
