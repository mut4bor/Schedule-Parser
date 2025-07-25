// routes/educationTypes.ts
import { Router } from 'express'
import { EducationTypesController } from '../controllers/educationTypesController.js'
import { authenticateToken } from '../middleware/auth.js'

const router = Router()

router.use(authenticateToken)

router.get('/', EducationTypesController.getAll)
router.get('/:id', EducationTypesController.getById)

export { router as educationTypesRoutes }
