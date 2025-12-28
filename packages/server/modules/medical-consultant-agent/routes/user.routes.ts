import { Router } from 'express'
import { UserController } from '../controllers/user.controller'
import { authenticate, authorize } from '../middleware/auth.middleware'

const router = Router()
const controller = new UserController()

// All user routes require authentication
router.use(authenticate)

// Get all users (admin only)
router.get('/', authorize('admin'), controller.getAll)

// Get users by role (admin only)
router.get('/role/:role', authorize('admin'), controller.getByRole)

// Get user by ID
router.get('/:id', controller.getById)

// Update user (own profile or admin)
router.put('/:id', controller.update)

// Update user role (admin only)
router.patch('/:id/role', authorize('admin'), controller.updateRole)

// Delete user (admin only)
router.delete('/:id', authorize('admin'), controller.delete)

export default router
