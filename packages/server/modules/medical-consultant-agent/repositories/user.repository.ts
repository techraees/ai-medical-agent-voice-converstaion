import { UserModel, IUser } from '../models/user.model'
import type { PaginationOptions, PaginatedResult } from '../../../types/common'

export class UserRepository {
   async create(data: Partial<IUser>): Promise<IUser> {
      const user = new UserModel(data)
      return await user.save()
   }

   async findById(id: string): Promise<IUser | null> {
      return await UserModel.findById(id).select('-password -refreshToken')
   }

   async findByEmail(email: string): Promise<IUser | null> {
      return await UserModel.findOne({ email: email.toLowerCase() })
   }

   async findByEmailWithPassword(email: string): Promise<IUser | null> {
      return await UserModel.findOne({ email: email.toLowerCase() })
   }

   async findAll(options?: PaginationOptions): Promise<PaginatedResult<IUser>> {
      const page = options?.page || 1
      const limit = options?.limit || 10
      const skip = (page - 1) * limit

      const [data, total] = await Promise.all([
         UserModel.find().select('-password -refreshToken').skip(skip).limit(limit).sort({ createdAt: -1 }),
         UserModel.countDocuments(),
      ])

      return {
         data,
         total,
         page,
         limit,
         totalPages: Math.ceil(total / limit),
      }
   }

   async findByRole(role: string, options?: PaginationOptions): Promise<PaginatedResult<IUser>> {
      const page = options?.page || 1
      const limit = options?.limit || 10
      const skip = (page - 1) * limit

      const [data, total] = await Promise.all([
         UserModel.find({ role }).select('-password -refreshToken').skip(skip).limit(limit).sort({ createdAt: -1 }),
         UserModel.countDocuments({ role }),
      ])

      return {
         data,
         total,
         page,
         limit,
         totalPages: Math.ceil(total / limit),
      }
   }

   async update(id: string, data: Partial<IUser>): Promise<IUser | null> {
      return await UserModel.findByIdAndUpdate(id, data, { new: true }).select('-password -refreshToken')
   }

   async updateRefreshToken(id: string, refreshToken: string | null): Promise<IUser | null> {
      return await UserModel.findByIdAndUpdate(id, { refreshToken, lastLogin: new Date() }, { new: true }).select(
         '-password'
      )
   }

   async delete(id: string): Promise<boolean> {
      const result = await UserModel.findByIdAndDelete(id)
      return !!result
   }

   async emailExists(email: string): Promise<boolean> {
      const user = await UserModel.findOne({ email: email.toLowerCase() })
      return !!user
   }
}
