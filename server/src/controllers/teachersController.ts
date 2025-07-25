// controllers/teachersController.ts
import { Request, Response } from 'express'
import { query } from '../database/connection.js'
import { CreateTeacherDto } from '../types/database.js'

export class TeachersController {
  static async getAll(req: Request, res: Response) {
    try {
      const { search } = req.query // 'search' будет использоваться для поиска по ФИО
      let queryText = 'SELECT id, first_name, surname, patronymic FROM teachers' // Выбираем только нужные поля
      let params: any[] = []
      const orderBy = 'ORDER BY patronymic, first_name, surname' // Упорядочиваем по ФИО

      if (search) {
        queryText += ` WHERE first_name ILIKE $1 OR surname ILIKE $1 OR patronymic ILIKE $1`
        params = [`%${search}%`]
      }

      queryText += ` ${orderBy}` // Добавляем сортировку

      const result = await query(queryText, params)
      res.json(result.rows)
    } catch (error) {
      console.error('Error fetching teachers:', error) // Для отладки
      res.status(500).json({ error: 'Server error' })
    }
  }

  static async getById(req: Request, res: Response) {
    try {
      const { id } = req.params
      const result = await query('SELECT * FROM teachers WHERE id = $1', [id])

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Teacher not found' })
      }

      res.json(result.rows[0])
    } catch (error) {
      res.status(500).json({ error: 'Server error' })
    }
  }

  static async create(req: Request, res: Response) {
    try {
      const { first_name, surname, patronymic }: CreateTeacherDto = req.body

      const result = await query(
        'INSERT INTO teachers (first_name, surname, patronymic) VALUES ($1, $2, $3) RETURNING *',
        [first_name, surname, patronymic],
      )

      res.status(201).json(result.rows[0])
    } catch (error) {
      res.status(500).json({ error: 'Server error' })
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const { id } = req.params
      const { first_name, surname, patronymic }: CreateTeacherDto = req.body

      const result = await query(
        'UPDATE teachers SET first_name = $1, surname = $2, patronymic = $3 WHERE id = $4 RETURNING *',
        [first_name, surname, patronymic, id],
      )

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Teacher not found' })
      }

      res.json(result.rows[0])
    } catch (error) {
      res.status(500).json({ error: 'Server error' })
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      const { id } = req.params

      const result = await query('DELETE FROM teachers WHERE id = $1 RETURNING *', [id])

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Teacher not found' })
      }

      res.json({ message: 'Teacher deleted successfully' })
    } catch (error) {
      res.status(500).json({ error: 'Server error' })
    }
  }
}
