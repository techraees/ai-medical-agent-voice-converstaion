import { Router } from 'express'
import personalPortfolioRoutes from './modules/personal-portfolio/routes'
import medicalConsultantAgentRoutes from './modules/medical-consultant-agent/routes'
import themeParkChatbotRoutes from './modules/theme-part-chatbot/routes'
import productReviewsSummarizerRoutes from './modules/product-reviews-summarizer/routes'
import cyberSecurityRagSystemRoutes from './modules/cyber-security-rag-system/routes'

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
router.use('/api/theme-park-chatbot', themeParkChatbotRoutes)
router.use('/api/product-reviews-summarizer', productReviewsSummarizerRoutes)
router.use('/api/cyber-security-rag-system', cyberSecurityRagSystemRoutes)

export default router
