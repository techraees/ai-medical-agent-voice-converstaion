import { UserRepository } from '../repositories/user.repository'
import { IUser, UserRole } from '../models/user.model'
import type { PaginationOptions, PaginatedResult } from '../../../types/common'

export class UserService {
   private repository: UserRepository

   constructor() {
      this.repository = new UserRepository()
   }

   async createUser(data: Partial<IUser>): Promise<IUser> {
      // Check if email already exists
      const emailExists = await this.repository.emailExists(data.email || '')
      if (emailExists) {
         throw new Error('Email already exists')
      }

      return await this.repository.create(data)
   }

   async getUserById(id: string): Promise<IUser | null> {
      return await this.repository.findById(id)
   }

   async getUserByEmail(email: string): Promise<IUser | null> {
      return await this.repository.findByEmail(email)
   }

   async getAllUsers(options?: PaginationOptions): Promise<PaginatedResult<IUser>> {
      return await this.repository.findAll(options)
   }

   async getUsersByRole(role: UserRole, options?: PaginationOptions): Promise<PaginatedResult<IUser>> {
      return await this.repository.findByRole(role, options)
   }

   async updateUser(id: string, data: Partial<IUser>): Promise<IUser | null> {
      // If email is being updated, check if it already exists
      if (data.email) {
         const existingUser = await this.repository.findByEmail(data.email)
         if (existingUser && existingUser._id.toString() !== id) {
            throw new Error('Email already exists')
         }
      }

      return await this.repository.update(id, data)
   }

   async deleteUser(id: string): Promise<boolean> {
      return await this.repository.delete(id)
   }

   async updateUserRole(id: string, role: UserRole): Promise<IUser | null> {
      return await this.repository.update(id, { role })
   }
}
