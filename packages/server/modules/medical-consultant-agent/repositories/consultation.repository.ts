import { ConsultationModel, IConsultation } from '../models/consultation.model'
import type { PaginationOptions, PaginatedResult } from '../../../types/common'

export class ConsultationRepository {
   async create(data: Partial<IConsultation>): Promise<IConsultation> {
      const consultation = new ConsultationModel(data)
      return await consultation.save()
   }

   async findById(id: string): Promise<IConsultation | null> {
      return await ConsultationModel.findById(id)
   }

   async findByDoctorId(doctorId: string, options?: PaginationOptions): Promise<PaginatedResult<IConsultation>> {
      const page = options?.page || 1
      const limit = options?.limit || 10
      const skip = (page - 1) * limit

      const [data, total] = await Promise.all([
         ConsultationModel.find({ doctorId }).skip(skip).limit(limit).sort({ createdAt: -1 }),
         ConsultationModel.countDocuments({ doctorId }),
      ])

      return {
         data,
         total,
         page,
         limit,
         totalPages: Math.ceil(total / limit),
      }
   }

   async findAll(options?: PaginationOptions): Promise<PaginatedResult<IConsultation>> {
      const page = options?.page || 1
      const limit = options?.limit || 10
      const skip = (page - 1) * limit

      const [data, total] = await Promise.all([
         ConsultationModel.find().skip(skip).limit(limit).sort({ createdAt: -1 }),
         ConsultationModel.countDocuments(),
      ])

      return {
         data,
         total,
         page,
         limit,
         totalPages: Math.ceil(total / limit),
      }
   }

   async update(id: string, data: Partial<IConsultation>): Promise<IConsultation | null> {
      return await ConsultationModel.findByIdAndUpdate(id, data, { new: true })
   }

   async delete(id: string): Promise<boolean> {
      const result = await ConsultationModel.findByIdAndDelete(id)
      return !!result
   }
}
