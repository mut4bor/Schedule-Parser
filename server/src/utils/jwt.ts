import jwt from 'jsonwebtoken'
import { JwtPayload } from '@/types/index.js'
import { AUTH_CONFIG } from '@/config/auth.js'

export const generateAccessToken = (payload: JwtPayload): string => {
  return jwt.sign(payload, AUTH_CONFIG.JWT_SECRET, {
    expiresIn: AUTH_CONFIG.JWT_EXPIRES_IN,
  })
}

export const generateRefreshToken = (payload: JwtPayload): string => {
  return jwt.sign(payload, AUTH_CONFIG.JWT_SECRET, {
    expiresIn: AUTH_CONFIG.REFRESH_TOKEN_EXPIRES_IN,
  })
}

export const verifyToken = (token: string): JwtPayload => {
  return jwt.verify(token, AUTH_CONFIG.JWT_SECRET) as JwtPayload
}
