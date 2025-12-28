import { Router } from 'express'
import authRoutes from './auth.routes'
import userRoutes from './user.routes'
import consultationRoutes from './consultation.routes'

const router = Router()

router.use('/auth', authRoutes)
router.use('/users', userRoutes)
router.use('/consultations', consultationRoutes)

export default router
