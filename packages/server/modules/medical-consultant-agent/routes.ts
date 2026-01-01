import { Router } from 'express'
import doctorsController from './controllers/doctors.controller'

const router = Router()

router.get('/doctors-list', doctorsController.getListOfDoctors)
router.post('/suggested-doctors-list', doctorsController.getSuggestedDoctors)

export default router
