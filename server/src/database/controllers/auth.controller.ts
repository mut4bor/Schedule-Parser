import { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { env } from '@/config/index.js'
import { User } from '@/database/models/user.model.js'

function signAccessToken(payload: object) {
  return jwt.sign(payload, env.JWT_SECRET, { expiresIn: '1h' })
}

function signRefreshToken(payload: object) {
  return jwt.sign(payload, env.JWT_REFRESH_SECRET, { expiresIn: '7d' })
}

export const register = async (req: Request, res: Response) => {
  try {
    const { username, password, email } = req.body

    if (!username || !password) {
      return res.status(400).json({ message: 'Username и password обязательны' })
    }

    const existing = await User.findOne({ username })
    if (existing) {
      return res.status(409).json({ message: 'Пользователь с таким username уже существует' })
    }

    const passwordHash = await bcrypt.hash(password, 10)

    await User.create({
      username,
      email,
      passwordHash,
      role: 'admin',
      isApproved: false,
      isActive: true,
    })

    return res.status(201).json({
      message: 'Регистрация успешна. Дождитесь подтверждения учетной записи администратором.',
    })
  } catch (error) {
    res.status(500).json({
      message: error instanceof Error ? error.message : 'Неизвестная ошибка',
    })
  }
}

export const login = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body

    const user = await User.findOne({ username })
    if (!user) {
      return res.status(401).json({ message: 'Неверные учетные данные' })
    }

    if (!user.isActive) {
      return res.status(403).json({ message: 'Учетная запись отключена' })
    }

    if (!user.isApproved) {
      return res.status(403).json({
        message: 'Учетная запись не подтверждена администратором',
      })
    }

    const isValid = await bcrypt.compare(password, user.passwordHash)
    if (!isValid) {
      return res.status(401).json({ message: 'Неверные учетные данные' })
    }

    const payload = { id: user.id, username: user.username, role: user.role }
    const accessToken = signAccessToken(payload)
    const refreshToken = signRefreshToken(payload)

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/auth/refresh',
    })

    return res.json({ accessToken })
  } catch (error) {
    res.status(500).json({
      message: error instanceof Error ? error.message : 'Неизвестная ошибка',
    })
  }
}

export const logout = async (_req: Request, res: Response) => {
  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/auth/refresh',
  })
  return res.json({ message: 'Logged out' })
}

export const refresh = async (req: Request, res: Response) => {
  try {
    const token = req.cookies?.refreshToken
    if (!token) {
      return res.status(401).json({ message: 'Нет токена обновления' })
    }

    jwt.verify(token, env.JWT_REFRESH_SECRET, async (err: any, decoded: any) => {
      if (err || !decoded?.id) {
        return res.status(403).json({ message: 'Неверный токен обновления' })
      }

      const user = await User.findById(decoded.id)
      if (!user || !user.isActive || !user.isApproved) {
        return res.status(403).json({ message: 'Доступ запрещен' })
      }

      const payload = {
        id: user.id,
        username: user.username,
        role: user.role,
      }
      const accessToken = signAccessToken(payload)

      return res.json({ accessToken })
    })
  } catch (error) {
    res.status(500).json({
      message: error instanceof Error ? error.message : 'Неизвестная ошибка',
    })
  }
}
