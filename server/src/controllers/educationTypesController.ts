// controllers/educationTypesController.ts
import { Request, Response } from 'express'
import { query } from '../database/connection.js'

export class EducationTypesController {
  static async getAll(req: Request, res: Response) {
    try {
      const result = await query('SELECT * FROM education_types ORDER BY name')
      res.json(result.rows)
    } catch (error) {
      res.status(500).json({ error: 'Server error' })
    }
  }

  static async getById(req: Request, res: Response) {
    try {
      const { id } = req.params
      const result = await query('SELECT * FROM education_types WHERE id = $1', [id])

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Education type not found' })
      }

      res.json(result.rows[0])
    } catch (error) {
      res.status(500).json({ error: 'Server error' })
    }
  }
}
