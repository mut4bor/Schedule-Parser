// routes/teachers.ts
import { Router } from 'express'
import { TeachersController } from '../controllers/teachersController.js'
import { authenticateToken } from '../middleware/auth.js'
import { validateTeacher } from '@/middleware/validation.js'

const router = Router()

// Все роуты требуют аутентификации
// router.use(authenticateToken)

router.get('/', TeachersController.getAll)
router.get('/:id', TeachersController.getById)
router.post('/', validateTeacher, TeachersController.create)
router.put('/:id', validateTeacher, TeachersController.update)
router.delete('/:id', TeachersController.delete)

export { router as teachersRoutes }
