import { Request, Response, NextFunction } from 'express'
import { verifyToken } from '@/utils/jwt.js'

export const authenticateToken = (req: Request, res: Response, next: NextFunction): void => {
  const token = req.cookies.accessToken

  if (!token) {
    res.status(401).json({ message: 'Access token required' })
    return
  }

  try {
    const decoded = verifyToken(token)
    req.user = decoded
    next()
  } catch (error) {
    res.status(403).json({ message: 'Invalid or expired token' })
  }
}

export const requireAdmin = (req: Request, res: Response, next: NextFunction): void => {
  if (!req.user || req.user.role !== 'admin') {
    res.status(403).json({ message: 'Admin access required' })
    return
  }
  next()
}
