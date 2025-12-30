import { Router } from 'express'
import { chatController } from './controllers/chat.controller'

const router = Router()

router.get('/', (req, res) => {
   res.send('Hello World')
})

router.post('/chat', chatController.sendMessage)

export default router
