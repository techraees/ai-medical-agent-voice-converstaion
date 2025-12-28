import { Schema, model, Model } from 'mongoose'
import type { BaseDocument } from '../../../types/common'
import { getCollectionName } from '../config'

export interface IExample extends BaseDocument {
   name: string
   description?: string
   status: 'active' | 'inactive'
}

const ExampleSchema = new Schema<IExample>(
   {
      name: {
         type: String,
         required: true,
         trim: true,
      },
      description: {
         type: String,
         trim: true,
      },
      status: {
         type: String,
         enum: ['active', 'inactive'],
         default: 'active',
      },
   },
   {
      timestamps: true,
   }
)

export const ExampleModel: Model<IExample> = model<IExample>('Example', ExampleSchema, getCollectionName('examples'))
