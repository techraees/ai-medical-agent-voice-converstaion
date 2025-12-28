import { ConsultationRepository } from '../repositories/consultation.repository'
import { IConsultation } from '../models/consultation.model'
import type { PaginationOptions, PaginatedResult } from '../../../types/common'

export class ConsultationService {
   private repository: ConsultationRepository

   constructor() {
      this.repository = new ConsultationRepository()
   }

   async createConsultation(data: Partial<IConsultation>): Promise<IConsultation> {
      return await this.repository.create(data)
   }

   async getConsultationById(id: string): Promise<IConsultation | null> {
      return await this.repository.findById(id)
   }

   async getConsultationsByDoctorId(
      doctorId: string,
      options?: PaginationOptions
   ): Promise<PaginatedResult<IConsultation>> {
      return await this.repository.findByDoctorId(doctorId, options)
   }

   async getAllConsultations(options?: PaginationOptions): Promise<PaginatedResult<IConsultation>> {
      return await this.repository.findAll(options)
   }

   async updateConsultation(id: string, data: Partial<IConsultation>): Promise<IConsultation | null> {
      return await this.repository.update(id, data)
   }

   async deleteConsultation(id: string): Promise<boolean> {
      return await this.repository.delete(id)
   }
}
