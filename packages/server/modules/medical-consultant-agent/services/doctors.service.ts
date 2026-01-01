import type { DoctorsList } from '../data/doctorsList.enums'
import { llmClient } from '../llm/client'
import { DoctorRepository } from '../repositories/doctor.repository'

export class DoctorsService {
   private repository: DoctorRepository

   constructor() {
      this.repository = new DoctorRepository()
   }

   getListOfDoctors(): DoctorsList[] {
      return this.repository.getListOfDoctors()
   }

   async getSuggestedDoctors({ prompt }: { prompt: string }): Promise<any> {
      const allDoctorsList = this.repository.getListOfDoctors()

      const jsonStringOfDoctorsList = JSON.stringify(allDoctorsList)

      const response = await llmClient.getSuggestedDoctors({
         prompt,
         listOfDoctors: jsonStringOfDoctorsList,
      })

      const parseDoctors = JSON.parse(response)

      return parseDoctors
   }
}
