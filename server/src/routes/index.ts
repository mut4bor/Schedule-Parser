// routes/index.ts
import { Router } from 'express'
import { authRoutes } from './auth.js'
import { teachersRoutes } from './teachers.js'
import { groupsRoutes } from './groups.js'
import { schedulesRoutes } from './schedules.js'
import { educationTypesRoutes } from './educationTypes.js'

const router = Router()

router.use('/auth', authRoutes)
router.use('/teachers', teachersRoutes)
router.use('/groups', groupsRoutes)
router.use('/schedules', schedulesRoutes)
router.use('/education-types', educationTypesRoutes)

export { router as apiRoutes }
