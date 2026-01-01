import { AIDoctorAgents, type DoctorsList } from '../data/doctorsList.enums'

export class DoctorRepository {
   getListOfDoctors(): DoctorsList[] {
      return AIDoctorAgents
   }
}
