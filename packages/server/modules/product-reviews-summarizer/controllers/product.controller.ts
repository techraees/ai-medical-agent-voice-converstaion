import type { Request, Response } from 'express'
import { prisma } from '../../../lib/prisma'

export const productController = {
   async getProducts(req: Request, res: Response) {
      const products = await prisma.review.findMany({})

      console.log(products)
      res.json({
         products,
      })
   },
}
