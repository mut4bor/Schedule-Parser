// controllers/groupsController.ts
import { Request, Response } from 'express'
import { query } from '../database/connection.js'
import { CreateGroupDto } from '../types/database.js'

export class GroupsController {
  static async getAll(req: Request, res: Response) {
    try {
      const { education_type_id, course } = req.query

      let queryText = `
        SELECT g.*, et.name as education_type_name 
        FROM groups g 
        JOIN education_types et ON g.education_type_id = et.id 
        ORDER BY g.name
      `
      let params: any[] = []

      if (education_type_id || course) {
        const conditions = []
        if (education_type_id) {
          conditions.push('g.education_type_id = $' + (params.length + 1))
          params.push(education_type_id)
        }
        if (course) {
          conditions.push('g.course = $' + (params.length + 1))
          params.push(course)
        }

        queryText = `
          SELECT g.*, et.name as education_type_name 
          FROM groups g 
          JOIN education_types et ON g.education_type_id = et.id 
          WHERE ${conditions.join(' AND ')}
          ORDER BY g.name
        `
      }

      const result = await query(queryText, params)
      res.json(result.rows)
    } catch (error) {
      res.status(500).json({ error: 'Server error' })
    }
  }

  static async getById(req: Request, res: Response) {
    try {
      const { id } = req.params
      const result = await query(
        `SELECT g.*, et.name as education_type_name 
         FROM groups g 
         JOIN education_types et ON g.education_type_id = et.id 
         WHERE g.id = $1`,
        [id],
      )

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Group not found' })
      }

      res.json(result.rows[0])
    } catch (error) {
      res.status(500).json({ error: 'Server error' })
    }
  }

  static async create(req: Request, res: Response) {
    try {
      const { name, course, education_type_id }: CreateGroupDto = req.body

      const result = await query(
        'INSERT INTO groups (name, course, education_type_id) VALUES ($1, $2, $3) RETURNING *',
        [name, course, education_type_id],
      )

      res.status(201).json(result.rows[0])
    } catch (error: any) {
      if (error.code === '23505') {
        // unique constraint violation
        res.status(400).json({ error: 'Group with this name already exists for this education type' })
      } else {
        res.status(500).json({ error: 'Server error' })
      }
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const { id } = req.params
      const { name, course, education_type_id }: CreateGroupDto = req.body

      const result = await query(
        'UPDATE groups SET name = $1, course = $2, education_type_id = $3 WHERE id = $4 RETURNING *',
        [name, course, education_type_id, id],
      )

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Group not found' })
      }

      res.json(result.rows[0])
    } catch (error) {
      res.status(500).json({ error: 'Server error' })
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      const { id } = req.params

      const result = await query('DELETE FROM groups WHERE id = $1 RETURNING *', [id])

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Group not found' })
      }

      res.json({ message: 'Group deleted successfully' })
    } catch (error) {
      res.status(500).json({ error: 'Server error' })
    }
  }
}
