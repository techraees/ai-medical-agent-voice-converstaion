import { Router } from 'express'

const router = Router()

router.get('/api/users', (req, res) => {
   res.json({
      message: 'Hello World. Future Chal Mera Putt.',
   })
})

export default router
