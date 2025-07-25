// routes/auth.ts (обновленная версия)
import { Router } from 'express'
import { AuthController } from '../controllers/authController.js'
import { validateAuth } from '../middleware/validation.js'

const router = Router()

router.post('/register', validateAuth, AuthController.register)
router.post('/login', validateAuth, AuthController.login)

export { router as authRoutes }
