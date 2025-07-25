// controllers/authController.ts
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { Request, Response } from 'express'
import { query } from '../database/connection.js'
import { AuthDto } from '../types/database.js'

export class AuthController {
  static async register(req: Request, res: Response) {
    try {
      const { username, password }: AuthDto = req.body

      const existingUser = await query('SELECT id FROM users WHERE username = $1', [username])

      if (existingUser.rows.length > 0) {
        return res.status(400).json({ error: 'Username already exists' })
      }

      const saltRounds = 10
      const password_hash = await bcrypt.hash(password, saltRounds)

      const result = await query(
        'INSERT INTO users (username, password_hash) VALUES ($1, $2) RETURNING id, username, role',
        [username, password_hash],
      )

      const user = result.rows[0]
      const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, process.env.JWT_SECRET!, {
        expiresIn: '24h',
      })

      res.status(201).json({ user, token })
    } catch (error) {
      res.status(500).json({ error: 'Server error' })
    }
  }

  static async login(req: Request, res: Response) {
    try {
      const { username, password }: AuthDto = req.body

      const result = await query('SELECT id, username, password_hash, role FROM users WHERE username = $1', [username])

      if (result.rows.length === 0) {
        return res.status(401).json({ error: 'Invalid credentials' })
      }

      const user = result.rows[0]
      const isValidPassword = await bcrypt.compare(password, user.password_hash)

      if (!isValidPassword) {
        return res.status(401).json({ error: 'Invalid credentials' })
      }

      const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, process.env.JWT_SECRET!, {
        expiresIn: '24h',
      })

      res.json({
        user: { id: user.id, username: user.username, role: user.role },
        token,
      })
    } catch (error) {
      res.status(500).json({ error: 'Server error' })
    }
  }
}
