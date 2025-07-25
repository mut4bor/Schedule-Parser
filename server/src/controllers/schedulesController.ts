// controllers/schedulesController.ts
import { Request, Response } from 'express'
import { query } from '../database/connection.js'
import { CreateScheduleDto } from '../types/database.js'

export class SchedulesController {
  static async getAll(req: Request, res: Response) {
    try {
      const { group_id, date_from, date_to, teacher_id } = req.query

      let queryText = `
        SELECT s.*, g.name as group_name,
               json_agg(
                 json_build_object(
                   'id', l.id,
                   'start_time', l.start_time,
                   'end_time', l.end_time,
                   'subject_name', l.subject_name,
                   'classroom', l.classroom,
                   'teacher_id', l.teacher_id,
                   'teacher_name', t.full_name
                 ) ORDER BY l.start_time
               ) as lessons
        FROM schedules s
        JOIN groups g ON s.group_id = g.id
        LEFT JOIN lessons l ON s.id = l.schedule_id
        LEFT JOIN teachers t ON l.teacher_id = t.id
      `

      const conditions = []
      const params: any[] = []

      if (group_id) {
        conditions.push('s.group_id = $' + (params.length + 1))
        params.push(group_id)
      }

      if (date_from) {
        conditions.push('s.schedule_date >= $' + (params.length + 1))
        params.push(date_from)
      }

      if (date_to) {
        conditions.push('s.schedule_date <= $' + (params.length + 1))
        params.push(date_to)
      }

      if (teacher_id) {
        conditions.push('l.teacher_id = $' + (params.length + 1))
        params.push(teacher_id)
      }

      if (conditions.length > 0) {
        queryText += ' WHERE ' + conditions.join(' AND ')
      }

      queryText += ' GROUP BY s.id, g.name ORDER BY s.schedule_date'

      const result = await query(queryText, params)
      res.json(result.rows)
    } catch (error) {
      res.status(500).json({ error: 'Server error' })
    }
  }

  static async getById(req: Request, res: Response) {
    try {
      const { id } = req.params

      const scheduleResult = await query(
        `SELECT s.*, g.name as group_name 
         FROM schedules s 
         JOIN groups g ON s.group_id = g.id 
         WHERE s.id = $1`,
        [id],
      )

      if (scheduleResult.rows.length === 0) {
        return res.status(404).json({ error: 'Schedule not found' })
      }

      const lessonsResult = await query(
        `SELECT l.*, t.full_name as teacher_name 
         FROM lessons l 
         LEFT JOIN teachers t ON l.teacher_id = t.id 
         WHERE l.schedule_id = $1 
         ORDER BY l.start_time`,
        [id],
      )

      const schedule = scheduleResult.rows[0]
      schedule.lessons = lessonsResult.rows

      res.json(schedule)
    } catch (error) {
      res.status(500).json({ error: 'Server error' })
    }
  }

  static async create(req: Request, res: Response) {
    try {
      const { group_id, schedule_date, lessons }: CreateScheduleDto = req.body

      // Начинаем транзакцию
      await query('BEGIN')

      try {
        // Создаем расписание
        const scheduleResult = await query(
          'INSERT INTO schedules (group_id, schedule_date) VALUES ($1, $2) RETURNING *',
          [group_id, schedule_date],
        )

        const schedule = scheduleResult.rows[0]

        // Добавляем занятия
        if (lessons && lessons.length > 0) {
          for (const lesson of lessons) {
            await query(
              `INSERT INTO lessons (schedule_id, start_time, end_time, subject_name, classroom, teacher_id) 
               VALUES ($1, $2, $3, $4, $5, $6)`,
              [
                schedule.id,
                lesson.start_time,
                lesson.end_time,
                lesson.subject_name,
                lesson.classroom,
                lesson.teacher_id,
              ],
            )
          }
        }

        await query('COMMIT')

        // Возвращаем созданное расписание с занятиями
        const fullSchedule = await this.getScheduleWithLessons(schedule.id)
        res.status(201).json(fullSchedule)
      } catch (error) {
        await query('ROLLBACK')
        throw error
      }
    } catch (error: any) {
      if (error.code === '23505') {
        // unique constraint violation
        res.status(400).json({ error: 'Schedule for this group and date already exists' })
      } else {
        res.status(500).json({ error: 'Server error' })
      }
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const { id } = req.params
      const { lessons }: { lessons: any[] } = req.body

      await query('BEGIN')

      try {
        // Обновляем время изменения расписания
        await query('UPDATE schedules SET updated_at = CURRENT_TIMESTAMP WHERE id = $1', [id])

        // Удаляем старые занятия
        await query('DELETE FROM lessons WHERE schedule_id = $1', [id])

        // Добавляем новые занятия
        if (lessons && lessons.length > 0) {
          for (const lesson of lessons) {
            await query(
              `INSERT INTO lessons (schedule_id, start_time, end_time, subject_name, classroom, teacher_id) 
               VALUES ($1, $2, $3, $4, $5, $6)`,
              [id, lesson.start_time, lesson.end_time, lesson.subject_name, lesson.classroom, lesson.teacher_id],
            )
          }
        }

        await query('COMMIT')

        const updatedSchedule = await this.getScheduleWithLessons(parseInt(id))
        res.json(updatedSchedule)
      } catch (error) {
        await query('ROLLBACK')
        throw error
      }
    } catch (error) {
      res.status(500).json({ error: 'Server error' })
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      const { id } = req.params

      const result = await query('DELETE FROM schedules WHERE id = $1 RETURNING *', [id])

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Schedule not found' })
      }

      res.json({ message: 'Schedule deleted successfully' })
    } catch (error) {
      res.status(500).json({ error: 'Server error' })
    }
  }

  private static async getScheduleWithLessons(scheduleId: number) {
    const scheduleResult = await query(
      `SELECT s.*, g.name as group_name 
       FROM schedules s 
       JOIN groups g ON s.group_id = g.id 
       WHERE s.id = $1`,
      [scheduleId],
    )

    const lessonsResult = await query(
      `SELECT l.*, t.full_name as teacher_name 
       FROM lessons l 
       LEFT JOIN teachers t ON l.teacher_id = t.id 
       WHERE l.schedule_id = $1 
       ORDER BY l.start_time`,
      [scheduleId],
    )

    const schedule = scheduleResult.rows[0]
    schedule.lessons = lessonsResult.rows

    return schedule
  }
}
