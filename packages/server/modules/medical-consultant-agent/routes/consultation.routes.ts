import { Router } from 'express'
import { ConsultationController } from '../controllers/consultation.controller'
import { authenticate } from '../middleware/auth.middleware'

const router = Router()
const controller = new ConsultationController()

// All consultation routes require authentication
router.use(authenticate)

router.post('/', controller.create)
router.get('/', controller.getAll)
router.get('/doctor/:doctorId', controller.getByDoctorId)
router.get('/:id', controller.getById)
router.put('/:id', controller.update)
router.delete('/:id', controller.delete)

export default router
