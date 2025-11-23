import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { env } from '@/config/index.js'
import { User, UserRole } from '@/database/models/user.model.js'

export interface JwtPayload {
  id: string
  username: string
  role: UserRole
  iat?: number
  exp?: number
}

declare module 'express-serve-static-core' {
  interface Request {
    authUser?: {
      id: string
      username: string
      role: UserRole
    }
  }
}

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization']
  const token = authHeader?.split(' ')[1]
  if (!token) {
    return res.status(401).json({ message: 'No token provided' })
  }

  jwt.verify(token, env.JWT_SECRET, async (err, decoded) => {
    if (err) return res.status(403).json({ message: 'Invalid token' })

    const payload = decoded as JwtPayload
    const user = await User.findById(payload.id).select('username role isApproved isActive')

    if (!user || !user.isActive || !user.isApproved) {
      return res.status(403).json({ message: 'Access denied' })
    }

    req.authUser = {
      id: user.id,
      username: user.username,
      role: user.role,
    }

    next()
  })
}

export function requireApproved(req: Request, res: Response, next: NextFunction) {
  // Если вызвали отдельно, предполагается, что authMiddleware уже прошел
  if (!req.authUser) {
    return res.status(401).json({ message: 'Unauthorized' })
  }
  next()
}

export function requireRole(role: UserRole): (req: Request, res: Response, next: NextFunction) => void {
  return (req, res, next) => {
    if (!req.authUser) {
      console.log('No authUser')
      return res.status(401).json({ message: 'Unauthorized' })
    }

    const order = { admin: 1, superadmin: 2 }
    if (order[req.authUser.role] < order[role]) {
      return res.status(403).json({ message: 'Forbidden' })
    }
    next()
  }
}
