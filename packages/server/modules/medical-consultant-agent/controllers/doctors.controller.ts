import type { Request, Response } from 'express'
import { DoctorsService } from '../services/doctors.service'

const doctorsService = new DoctorsService()

export default {
   getListOfDoctors(req: Request, res: Response) {
      const doctors = doctorsService.getListOfDoctors()
      res.json(doctors)
   },

   async getSuggestedDoctors(req: Request, res: Response) {
      const doctors = await doctorsService.getSuggestedDoctors({
         prompt: req.body.prompt,
      })
      res.json(doctors)
   },
}
