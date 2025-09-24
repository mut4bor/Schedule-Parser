// controllers/authController.ts
import { Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import { User, JwtPayload } from '@/types/index.js'
import { generateAccessToken, generateRefreshToken, verifyToken } from '@/utils/jwt.js'
import { AUTH_CONFIG } from '@/config/auth.js'

// Моковая база данных пользователей (замени на реальную)
const users: User[] = [
  {
    id: '1',
    email: 'admin@example.com',
    password: '$2a$12$example', // хешированный пароль
    role: 'admin',
  },
]

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      res.status(400).json({ message: 'Email and password are required' })
      return
    }

    // Найти пользователя
    const user = users.find((u) => u.email === email)
    if (!user) {
      res.status(401).json({ message: 'Invalid credentials' })
      return
    }

    // Проверить пароль
    const isValidPassword = await bcrypt.compare(password, user.password)
    if (!isValidPassword) {
      res.status(401).json({ message: 'Invalid credentials' })
      return
    }

    // Создать токены
    const tokenPayload: JwtPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
    }

    const accessToken = generateAccessToken(tokenPayload)
    const refreshToken = generateRefreshToken(tokenPayload)

    // Установить cookies
    res.cookie('accessToken', accessToken, AUTH_CONFIG.COOKIE_OPTIONS)
    res.cookie('refreshToken', refreshToken, AUTH_CONFIG.REFRESH_COOKIE_OPTIONS)

    res.json({
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    })
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' })
  }
}

export const logout = (_req: Request, res: Response): void => {
  res.clearCookie('accessToken')
  res.clearCookie('refreshToken')
  res.json({ message: 'Logout successful' })
}

export const refreshToken = (req: Request, res: Response): void => {
  const refreshToken = req.cookies.refreshToken

  if (!refreshToken) {
    res.status(401).json({ message: 'Refresh token required' })
    return
  }

  try {
    const decoded = verifyToken(refreshToken)

    // Создать новые токены
    const tokenPayload: JwtPayload = {
      userId: decoded.userId,
      email: decoded.email,
      role: decoded.role,
    }

    const newAccessToken = generateAccessToken(tokenPayload)
    const newRefreshToken = generateRefreshToken(tokenPayload)

    // Обновить cookies
    res.cookie('accessToken', newAccessToken, AUTH_CONFIG.COOKIE_OPTIONS)
    res.cookie('refreshToken', newRefreshToken, AUTH_CONFIG.REFRESH_COOKIE_OPTIONS)

    res.json({ message: 'Tokens refreshed' })
  } catch (error) {
    res.status(403).json({ message: 'Invalid refresh token' })
  }
}

export const getProfile = (req: Request, res: Response): void => {
  res.json({ user: req.user })
}
