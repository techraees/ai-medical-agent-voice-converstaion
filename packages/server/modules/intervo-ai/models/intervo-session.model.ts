import mongoose, { Schema, Document } from 'mongoose'

export interface IIntervoSession extends Document {
   userId?: string
   topic: string
   region: string
   status: 'initialized' | 'in_progress' | 'completed'
   score?: number
   questions: string[]
   responses: {
      question: string
      userAnswer: string
      suggestedAnswer?: string
      analysis?: string
   }[]
   overallFeedback?: {
      strengths: string[]
      improvements: string[]
      marketTips: string[]
   }
   createdAt: Date
}

const IntervoSessionSchema: Schema = new Schema({
   userId: { type: String, required: false },
   topic: { type: String, required: true },
   region: { type: String, required: true },
   status: { type: String, enum: ['initialized', 'in_progress', 'completed'], default: 'initialized' },
   score: { type: Number, required: false },
   questions: { type: [String], required: true },
   responses: [
      {
         question: { type: String, required: true },
         userAnswer: { type: String, required: true },
         suggestedAnswer: { type: String, required: false },
         analysis: { type: String, required: false },
      },
   ],
   overallFeedback: {
      strengths: { type: [String], default: [] },
      improvements: { type: [String], default: [] },
      marketTips: { type: [String], default: [] },
   },
   createdAt: { type: Date, default: Date.now },
})

export const IntervoSession = mongoose.model<IIntervoSession>('IntervoSession', IntervoSessionSchema)
