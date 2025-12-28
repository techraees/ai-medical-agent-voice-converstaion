import { Router } from 'express'
import consultationRoutes from './consultation.routes'

const router = Router()

router.use('/consultations', consultationRoutes)

export default router
