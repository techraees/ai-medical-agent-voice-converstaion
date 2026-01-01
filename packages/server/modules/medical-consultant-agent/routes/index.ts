import { Router } from 'express'
import authRoutes from './auth.routes'
import userRoutes from './user.routes'
import consultationRoutes from './consultation.routes'
import doctorsRoutes from './doctors.routes'

const router = Router()

router.use('/auth', authRoutes)
router.use('/users', userRoutes)
router.use('/consultations', consultationRoutes)
router.use('/doctors', doctorsRoutes)

export default router
