import type { Request, Response } from 'express'
import { DoctorsService } from '../services/doctors.service'

export class DoctorsController {
   private service: DoctorsService

   constructor() {
      this.service = new DoctorsService()
   }

   getListOfDoctors = (req: Request, res: Response) => {
      const doctors = this.service.getListOfDoctors()
      res.json(doctors)
   }

   getSuggestedDoctors = async (req: Request, res: Response) => {
      const doctors = await this.service.getSuggestedDoctors({
         prompt: req.body.prompt,
      })
      res.json(doctors)
   }
}
