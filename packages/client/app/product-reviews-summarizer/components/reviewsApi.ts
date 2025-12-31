import axios from 'axios'

export type Review = {
   id: number
   author: string
   content: string
   rating: number
   createdAt: string
}

export type GetReviewsResponse = {
   summary: string | null
   reviews: Review[]
}

export type SummarizeResponse = {
   summary: string
}

export type Product = {
   id: number
   name: string
   description: string
   price: number
}

export type GetProductsResponse = {
   products: Product[]
}

export const reviewsApi = {
   fetchReviews(productId: number) {
      return axios
         .get<GetReviewsResponse>(`/api/product-reviews-summarizer/products/${productId}/reviews`)
         .then((res) => res.data)
   },

   summarizeReviews(productId: number) {
      return axios
         .post<SummarizeResponse>(`/api/product-reviews-summarizer/products/${productId}/reviews/summarize`)
         .then((res) => res.data)
   },

   getProducts() {
      return axios.get<GetProductsResponse>('/api/product-reviews-summarizer/products').then((res) => res.data)
   },
}
