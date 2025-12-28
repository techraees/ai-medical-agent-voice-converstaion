import { Document } from 'mongoose'

export interface BaseDocument extends Document {
   createdAt: Date
   updatedAt: Date
}

export interface PaginationOptions {
   page?: number
   limit?: number
}

export interface PaginatedResult<T> {
   data: T[]
   total: number
   page: number
   limit: number
   totalPages: number
}
