import { Router } from 'express'
import { summaryController } from './controllers/summary.controller'

const router = Router()

router.post('/summarize', summaryController.summarize)

export default router
