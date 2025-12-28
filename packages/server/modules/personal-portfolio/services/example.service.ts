import { ExampleRepository } from '../repositories/example.repository'
import { IExample } from '../models/example.model'
import type { PaginationOptions, PaginatedResult } from '../../../types/common'

export class ExampleService {
   private repository: ExampleRepository

   constructor() {
      this.repository = new ExampleRepository()
   }

   async createExample(data: Partial<IExample>): Promise<IExample> {
      return await this.repository.create(data)
   }

   async getExampleById(id: string): Promise<IExample | null> {
      return await this.repository.findById(id)
   }

   async getAllExamples(options?: PaginationOptions): Promise<PaginatedResult<IExample>> {
      return await this.repository.findAll(options)
   }

   async updateExample(id: string, data: Partial<IExample>): Promise<IExample | null> {
      return await this.repository.update(id, data)
   }

   async deleteExample(id: string): Promise<boolean> {
      return await this.repository.delete(id)
   }
}
