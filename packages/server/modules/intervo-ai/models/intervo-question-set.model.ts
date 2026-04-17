import mongoose, { Schema, Document } from 'mongoose'

export interface IIntervoQuestionSet extends Document {
   topic: string
   region: string
   questions: string[]
   createdAt: Date
}

const IntervoQuestionSetSchema: Schema = new Schema({
   topic: { type: String, required: true, lowercase: true, trim: true },
   region: { type: String, required: true, lowercase: true, trim: true },
   questions: { type: [String], required: true },
   createdAt: { type: Date, default: Date.now, expires: '7d' }, // Expire after 7 days to keep questions fresh
})

// Compound index for efficient lookup
IntervoQuestionSetSchema.index({ topic: 1, region: 1 }, { unique: true })

export const IntervoQuestionSet = mongoose.model<IIntervoQuestionSet>('IntervoQuestionSet', IntervoQuestionSetSchema)
