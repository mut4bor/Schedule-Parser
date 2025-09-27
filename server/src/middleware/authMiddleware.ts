import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { env } from '@/config/index.js'

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  if (req.method === 'GET') return next()

  const authHeader = req.headers['authorization']
  const token = authHeader?.split(' ')[1]
  if (!token) {
    return res.status(401).json({ message: 'No token provided' })
  }

  jwt.verify(token, env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid token' })
    ;(req as any).user = user
    next()
  })
}
