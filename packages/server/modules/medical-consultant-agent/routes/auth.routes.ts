import { Router } from 'express'
import { AuthController } from '../controllers/auth.controller'
import { authenticate } from '../middleware/auth.middleware'

const router = Router()
const controller = new AuthController()

// Public routes
router.post('/register', controller.register)
router.post('/login', controller.login)
router.post('/refresh-token', controller.refreshToken)

// Protected routes
router.post('/logout', authenticate, controller.logout)

export default router
