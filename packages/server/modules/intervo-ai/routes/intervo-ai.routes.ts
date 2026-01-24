import { Router } from 'express'
import { IntervoAIController } from '../controllers/intervo-ai.controller'

const router = Router()
const controller = new IntervoAIController()

router.get('/health', controller.getHealth)
router.post('/session/start', controller.startSession)
router.post('/session/answer', controller.submitAnswer)
router.get('/session/feedback/:sessionId', controller.getFeedback)
router.get('/sessions', controller.getHistory)
router.get('/sessions/:sessionId', controller.getSessionDetails)

export default router
