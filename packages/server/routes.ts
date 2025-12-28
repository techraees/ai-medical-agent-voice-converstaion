import { Router } from 'express'
import personalPortfolioRoutes from './modules/personal-portfolio/routes'
import medicalConsultantAgentRoutes from './modules/medical-consultant-agent/routes'

const router = Router()

// Health check route
router.get('/api/health', (req, res) => {
   res.json({
      message: 'Server is running',
      timestamp: new Date().toISOString(),
   })
})

// Module routes
router.use('/api/personal-portfolio', personalPortfolioRoutes)
router.use('/api/medical-consultant-agent', medicalConsultantAgentRoutes)

export default router
