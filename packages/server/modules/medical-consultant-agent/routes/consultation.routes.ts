import { Router } from 'express'
import { ConsultationController } from '../controllers/consultation.controller'

const router = Router()
const controller = new ConsultationController()

router.post('/', controller.create)
router.get('/', controller.getAll)
router.get('/doctor/:doctorId', controller.getByDoctorId)
router.get('/:id', controller.getById)
router.put('/:id', controller.update)
router.delete('/:id', controller.delete)

export default router
