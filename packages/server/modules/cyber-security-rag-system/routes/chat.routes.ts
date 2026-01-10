import { Router } from 'express'
import { ChatController } from '../controllers/chat.controller'

const router = Router()
const controller = new ChatController()

router.post('/', controller.chat)
router.post('/ingest', controller.ingest)

export default router
