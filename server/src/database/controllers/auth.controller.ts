import { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { env } from '@/config/index.js'
const REFRESH_SECRET = env.JWT_SECRET + '_refresh'

const users = [
  {
    id: 1,
    username: 'admin',
    password: bcrypt.hashSync(env.ADMIN_PASSWORD, 10),
  },
]

const login = async (req: Request, res: Response) => {
  const { username, password } = req.body
  const user = users.find((u) => u.username === username)
  if (!user) return res.status(401).json({ message: 'Неверные учетные данные' })

  const isValid = bcrypt.compareSync(password, user.password)
  if (!isValid) return res.status(401).json({ message: 'Неверные учетные данные' })

  const accessToken = jwt.sign({ id: user.id, username: user.username }, env.JWT_SECRET, { expiresIn: '1h' })
  const refreshToken = jwt.sign({ id: user.id, username: user.username }, REFRESH_SECRET, { expiresIn: '7d' })

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 дней
  })

  return res.json({ accessToken })
}

const logout = async (req: Request, res: Response) => {
  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  })
  return res.json({ message: 'Logged out' })
}

const refresh = async (req: Request, res: Response) => {
  const token = req.cookies?.refreshToken
  if (!token) return res.status(401).json({ message: 'Нет токена обновления' })

  jwt.verify(token, REFRESH_SECRET, (err: any, user: any) => {
    if (err) return res.status(403).json({ message: 'Неверный токен обновления' })

    const accessToken = jwt.sign({ id: user.id, username: user.username }, env.JWT_SECRET, {
      expiresIn: '1h',
    })

    return res.json({ accessToken })
  })
}

export { login, logout, refresh }
