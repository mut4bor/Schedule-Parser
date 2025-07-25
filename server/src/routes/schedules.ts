// routes/schedules.ts (обновленная версия)
import { Router } from 'express'
import { SchedulesController } from '../controllers/schedulesController.js'
import { authenticateToken } from '../middleware/auth.js'
import { validateSchedule } from '../middleware/validation.js'

const router = Router()

router.use(authenticateToken)

router.get('/', SchedulesController.getAll)
router.get('/:id', SchedulesController.getById)
router.post('/', validateSchedule, SchedulesController.create)
router.put('/:id', validateSchedule, SchedulesController.update)
router.delete('/:id', SchedulesController.delete)

export { router as schedulesRoutes }
