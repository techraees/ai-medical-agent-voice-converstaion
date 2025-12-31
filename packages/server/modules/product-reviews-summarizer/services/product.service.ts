import { productRepository } from '../repositories/product.repository'

export const productService = {
   async getProducts() {
      return productRepository.getProducts()
   },
}
