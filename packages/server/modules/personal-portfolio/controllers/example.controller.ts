import { Request, Response } from 'express'
import { ExampleService } from '../services/example.service'

export class ExampleController {
   private service: ExampleService

   constructor() {
      this.service = new ExampleService()
   }

   create = async (req: Request, res: Response): Promise<void> => {
      try {
         const example = await this.service.createExample(req.body)
         res.status(201).json({ success: true, data: example })
      } catch (error: any) {
         res.status(400).json({ success: false, message: error.message })
      }
   }

   getById = async (req: Request, res: Response): Promise<void> => {
      try {
         const { id } = req.params
         const example = await this.service.getExampleById(id)
         if (!example) {
            res.status(404).json({ success: false, message: 'Example not found' })
            return
         }
         res.status(200).json({ success: true, data: example })
      } catch (error: any) {
         res.status(500).json({ success: false, message: error.message })
      }
   }

   getAll = async (req: Request, res: Response): Promise<void> => {
      try {
         const page = parseInt(req.query.page as string) || 1
         const limit = parseInt(req.query.limit as string) || 10
         const result = await this.service.getAllExamples({ page, limit })
         res.status(200).json({ success: true, ...result })
      } catch (error: any) {
         res.status(500).json({ success: false, message: error.message })
      }
   }

   update = async (req: Request, res: Response): Promise<void> => {
      try {
         const { id } = req.params
         const example = await this.service.updateExample(id, req.body)
         if (!example) {
            res.status(404).json({ success: false, message: 'Example not found' })
            return
         }
         res.status(200).json({ success: true, data: example })
      } catch (error: any) {
         res.status(400).json({ success: false, message: error.message })
      }
   }

   delete = async (req: Request, res: Response): Promise<void> => {
      try {
         const { id } = req.params
         const deleted = await this.service.deleteExample(id)
         if (!deleted) {
            res.status(404).json({ success: false, message: 'Example not found' })
            return
         }
         res.status(200).json({ success: true, message: 'Example deleted successfully' })
      } catch (error: any) {
         res.status(500).json({ success: false, message: error.message })
      }
   }
}
