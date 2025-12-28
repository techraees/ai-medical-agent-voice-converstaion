import { Schema, model, Model } from 'mongoose'
import type { BaseDocument } from '../../../types/common'
import { getCollectionName } from '../config'

export interface IConsultation extends BaseDocument {
   patientName: string
   doctorId: string
   symptoms: string[]
   diagnosis?: string
   prescription?: string
   status: 'pending' | 'in-progress' | 'completed' | 'cancelled'
   appointmentDate?: Date
}

const ConsultationSchema = new Schema<IConsultation>(
   {
      patientName: {
         type: String,
         required: true,
         trim: true,
      },
      doctorId: {
         type: String,
         required: true,
      },
      symptoms: {
         type: [String],
         default: [],
      },
      diagnosis: {
         type: String,
         trim: true,
      },
      prescription: {
         type: String,
         trim: true,
      },
      status: {
         type: String,
         enum: ['pending', 'in-progress', 'completed', 'cancelled'],
         default: 'pending',
      },
      appointmentDate: {
         type: Date,
      },
   },
   {
      timestamps: true,
   }
)

export const ConsultationModel: Model<IConsultation> = model<IConsultation>(
   'Consultation',
   ConsultationSchema,
   getCollectionName('consultations')
)
