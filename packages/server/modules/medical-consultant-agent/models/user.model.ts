import { Schema, model, Model } from 'mongoose'
import type { BaseDocument } from '../../../types/common'
import { getCollectionName } from '../config'

export type UserRole = 'user' | 'consultant' | 'doctor' | 'admin'

export interface IUser extends BaseDocument {
   email: string
   password: string
   name: string
   role: UserRole
   phone?: string
   isActive: boolean
   isEmailVerified: boolean
   refreshToken?: string
   lastLogin?: Date
}

const UserSchema = new Schema<IUser>(
   {
      email: {
         type: String,
         required: true,
         unique: true,
         lowercase: true,
         trim: true,
      },
      password: {
         type: String,
         required: true,
         minlength: 6,
      },
      name: {
         type: String,
         required: true,
         trim: true,
      },
      role: {
         type: String,
         enum: ['user', 'consultant', 'doctor', 'admin'],
         default: 'user',
      },
      phone: {
         type: String,
         trim: true,
      },
      isActive: {
         type: Boolean,
         default: true,
      },
      isEmailVerified: {
         type: Boolean,
         default: false,
      },
      refreshToken: {
         type: String,
      },
      lastLogin: {
         type: Date,
      },
   },
   {
      timestamps: true,
   }
)

// Index for faster queries

export const UserModel: Model<IUser> = model<IUser>('User', UserSchema, getCollectionName('users'))
