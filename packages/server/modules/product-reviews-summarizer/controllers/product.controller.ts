import type { Request, Response } from 'express'
import { productService } from '../services/product.service'

export const productController = {
   async getProducts(req: Request, res: Response) {
      const products = await productService.getProducts()

      res.json({
         products,
      })
   },
}
