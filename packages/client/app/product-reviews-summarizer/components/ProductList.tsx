'use client'

import { useQuery } from '@tanstack/react-query'
import { reviewsApi, type GetProductsResponse } from './reviewsApi'
import { Button } from '../../../components/ui/button'

type Props = {
   onProductSelect: (productId: number) => void
}

const ProductList = ({ onProductSelect }: Props) => {
   const productsQuery = useQuery<GetProductsResponse>({
      queryKey: ['products'],
      queryFn: () => reviewsApi.getProducts(),
   })

   if (productsQuery.isLoading) {
      return <div>Loading products...</div>
   }

   if (productsQuery.isError) {
      return <div className="text-red-500">Error loading products</div>
   }

   return (
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
         {productsQuery.data?.products.map((product) => (
            <div key={product.id} className="border p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow">
               <h3 className="font-bold text-lg">{product.name}</h3>
               <p className="text-gray-600 text-sm mb-2">{product.description}</p>
               <p className="font-semibold text-green-600 mb-4">${product.price.toFixed(2)}</p>
               <Button onClick={() => onProductSelect(product.id)}>Show Reviews</Button>
            </div>
         ))}
      </div>
   )
}

export default ProductList
