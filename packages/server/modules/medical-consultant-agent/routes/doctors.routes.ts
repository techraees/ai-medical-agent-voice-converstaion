import { Router } from 'express'
import { DoctorsController } from '../controllers/doctors.controller'

const router = Router()
const controller = new DoctorsController()

router.post('/doctors-list', controller.getListOfDoctors)
router.post('/suggested-doctors-list', controller.getSuggestedDoctors)

export default router
