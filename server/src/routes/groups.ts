// routes/groups.ts (обновленная версия)
import { Router } from 'express'
import { GroupsController } from '../controllers/groupsController.js'
import { authenticateToken } from '../middleware/auth.js'
import { validateGroup } from '../middleware/validation.js'

const router = Router()

router.use(authenticateToken)

router.get('/', GroupsController.getAll)
router.get('/:id', GroupsController.getById)
router.post('/', validateGroup, GroupsController.create)
router.put('/:id', validateGroup, GroupsController.update)
router.delete('/:id', GroupsController.delete)

export { router as groupsRoutes }
