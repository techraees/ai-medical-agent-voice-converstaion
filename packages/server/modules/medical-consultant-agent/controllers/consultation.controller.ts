import { Request, Response } from 'express'
import { ConsultationService } from '../services/consultation.service'

export class ConsultationController {
   private service: ConsultationService

   constructor() {
      this.service = new ConsultationService()
   }

   create = async (req: Request, res: Response): Promise<void> => {
      try {
         const consultation = await this.service.createConsultation(req.body)
         res.status(201).json({ success: true, data: consultation })
      } catch (error: any) {
         res.status(400).json({ success: false, message: error.message })
      }
   }

   getById = async (req: Request, res: Response): Promise<void> => {
      try {
         const { id } = req.params
         const consultation = await this.service.getConsultationById(id)
         if (!consultation) {
            res.status(404).json({ success: false, message: 'Consultation not found' })
            return
         }
         res.status(200).json({ success: true, data: consultation })
      } catch (error: any) {
         res.status(500).json({ success: false, message: error.message })
      }
   }

   getAll = async (req: Request, res: Response): Promise<void> => {
      try {
         const page = parseInt(req.query.page as string) || 1
         const limit = parseInt(req.query.limit as string) || 10
         const result = await this.service.getAllConsultations({ page, limit })
         res.status(200).json({ success: true, ...result })
      } catch (error: any) {
         res.status(500).json({ success: false, message: error.message })
      }
   }

   getByDoctorId = async (req: Request, res: Response): Promise<void> => {
      try {
         const { doctorId } = req.params
         const page = parseInt(req.query.page as string) || 1
         const limit = parseInt(req.query.limit as string) || 10
         const result = await this.service.getConsultationsByDoctorId(doctorId, { page, limit })
         res.status(200).json({ success: true, ...result })
      } catch (error: any) {
         res.status(500).json({ success: false, message: error.message })
      }
   }

   update = async (req: Request, res: Response): Promise<void> => {
      try {
         const { id } = req.params
         const consultation = await this.service.updateConsultation(id, req.body)
         if (!consultation) {
            res.status(404).json({ success: false, message: 'Consultation not found' })
            return
         }
         res.status(200).json({ success: true, data: consultation })
      } catch (error: any) {
         res.status(400).json({ success: false, message: error.message })
      }
   }

   delete = async (req: Request, res: Response): Promise<void> => {
      try {
         const { id } = req.params
         const deleted = await this.service.deleteConsultation(id)
         if (!deleted) {
            res.status(404).json({ success: false, message: 'Consultation not found' })
            return
         }
         res.status(200).json({ success: true, message: 'Consultation deleted successfully' })
      } catch (error: any) {
         res.status(500).json({ success: false, message: error.message })
      }
   }
}
