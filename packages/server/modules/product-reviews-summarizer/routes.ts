import { Router } from 'express'
import { reviewController } from './controllers/review.controller'
import { productController } from './controllers/product.controller'

const router = Router()

router.get('/products', productController.getProducts)
router.get('/products/:id/reviews', reviewController.getReviews)
router.post('/products/:id/reviews/summarize', reviewController.summarizeReviews)
export default router
