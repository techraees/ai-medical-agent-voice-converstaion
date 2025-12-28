import { ExampleModel, IExample } from '../models/example.model'
import type { PaginationOptions, PaginatedResult } from '../../../types/common'

export class ExampleRepository {
   async create(data: Partial<IExample>): Promise<IExample> {
      const example = new ExampleModel(data)
      return await example.save()
   }

   async findById(id: string): Promise<IExample | null> {
      return await ExampleModel.findById(id)
   }

   async findAll(options?: PaginationOptions): Promise<PaginatedResult<IExample>> {
      const page = options?.page || 1
      const limit = options?.limit || 10
      const skip = (page - 1) * limit

      const [data, total] = await Promise.all([
         ExampleModel.find().skip(skip).limit(limit).sort({ createdAt: -1 }),
         ExampleModel.countDocuments(),
      ])

      return {
         data,
         total,
         page,
         limit,
         totalPages: Math.ceil(total / limit),
      }
   }

   async update(id: string, data: Partial<IExample>): Promise<IExample | null> {
      return await ExampleModel.findByIdAndUpdate(id, data, { new: true })
   }

   async delete(id: string): Promise<boolean> {
      const result = await ExampleModel.findByIdAndDelete(id)
      return !!result
   }
}
