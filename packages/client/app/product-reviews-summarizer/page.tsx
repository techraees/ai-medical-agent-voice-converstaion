'use client'

import React, { useState } from 'react'
import ReviewList from './components/ReviewList'
import ProductList from './components/ProductList'
import { Button } from '../../components/ui/button'

const ProductReviewSummarizer = () => {
   const [selectedProductId, setSelectedProductId] = useState<number | null>(null)

   return (
      <div className="container mx-auto py-8">
         <h1 className="text-3xl font-bold mb-6">Product Reviews Summarizer</h1>
         {selectedProductId ? (
            <div>
               <Button variant="outline" onClick={() => setSelectedProductId(null)} className="mb-4">
                  &larr; Back to Products
               </Button>
               <ReviewList productId={selectedProductId} />
            </div>
         ) : (
            <ProductList onProductSelect={setSelectedProductId} />
         )}
      </div>
   )
}

export default ProductReviewSummarizer
