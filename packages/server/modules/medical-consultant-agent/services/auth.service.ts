import { UserRepository } from '../repositories/user.repository'
import {
   hashPassword,
   comparePassword,
   generateAccessToken,
   generateRefreshToken,
   verifyRefreshToken,
   type TokenPayload,
} from '../utils/auth.utils'
import { IUser, UserRole } from '../models/user.model'

export interface RegisterData {
   email: string
   password: string
   name: string
   role?: UserRole
   phone?: string
}

export interface LoginData {
   email: string
   password: string
}

export interface AuthResponse {
   user: Omit<IUser, 'password' | 'refreshToken'>
   accessToken: string
   refreshToken: string
}

export class AuthService {
   private repository: UserRepository

   constructor() {
      this.repository = new UserRepository()
   }

   async register(data: RegisterData): Promise<AuthResponse> {
      // Check if email already exists
      const existingUser = await this.repository.findByEmail(data.email)
      if (existingUser) {
         throw new Error('Email already exists')
      }

      // Hash password
      const hashedPassword = await hashPassword(data.password)

      // Create user
      const user = await this.repository.create({
         ...data,
         password: hashedPassword,
         role: data.role || 'user',
      })

      // Generate tokens
      const tokenPayload: TokenPayload = {
         userId: user._id.toString(),
         email: user.email,
         role: user.role,
      }

      const accessToken = generateAccessToken(tokenPayload)
      const refreshToken = generateRefreshToken(tokenPayload)

      // Save refresh token to database
      await this.repository.updateRefreshToken(user._id.toString(), refreshToken)

      // Remove sensitive data
      const userResponse = {
         _id: user._id,
         email: user.email,
         name: user.name,
         role: user.role,
         phone: user.phone,
         isActive: user.isActive,
         isEmailVerified: user.isEmailVerified,
         createdAt: user.createdAt,
         updatedAt: user.updatedAt,
         lastLogin: user.lastLogin,
      }

      return {
         user: userResponse as any,
         accessToken,
         refreshToken,
      }
   }

   async login(data: LoginData): Promise<AuthResponse> {
      // Find user with password
      const user = await this.repository.findByEmailWithPassword(data.email)
      if (!user) {
         throw new Error('Invalid email or password')
      }

      // Check if user is active
      if (!user.isActive) {
         throw new Error('Account is deactivated')
      }

      // Verify password
      const isPasswordValid = await comparePassword(data.password, user.password)
      if (!isPasswordValid) {
         throw new Error('Invalid email or password')
      }

      // Generate tokens
      const tokenPayload: TokenPayload = {
         userId: user._id.toString(),
         email: user.email,
         role: user.role,
      }

      const accessToken = generateAccessToken(tokenPayload)
      const refreshToken = generateRefreshToken(tokenPayload)

      // Save refresh token to database
      await this.repository.updateRefreshToken(user._id.toString(), refreshToken)

      // Remove sensitive data
      const userResponse = {
         _id: user._id,
         email: user.email,
         name: user.name,
         role: user.role,
         phone: user.phone,
         isActive: user.isActive,
         isEmailVerified: user.isEmailVerified,
         createdAt: user.createdAt,
         updatedAt: user.updatedAt,
         lastLogin: user.lastLogin,
      }

      return {
         user: userResponse as any,
         accessToken,
         refreshToken,
      }
   }

   async refreshToken(refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> {
      try {
         // Verify refresh token
         const decoded = verifyRefreshToken(refreshToken)

         // Find user and verify refresh token matches
         const user = await this.repository.findByEmailWithPassword(decoded.email)
         if (!user || user.refreshToken !== refreshToken) {
            throw new Error('Invalid refresh token')
         }

         // Check if user is active
         if (!user.isActive) {
            throw new Error('Account is deactivated')
         }

         // Generate new tokens
         const tokenPayload: TokenPayload = {
            userId: user._id.toString(),
            email: user.email,
            role: user.role,
         }

         const newAccessToken = generateAccessToken(tokenPayload)
         const newRefreshToken = generateRefreshToken(tokenPayload)

         // Save new refresh token to database
         await this.repository.updateRefreshToken(user._id.toString(), newRefreshToken)

         return {
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
         }
      } catch (error: any) {
         throw new Error('Invalid or expired refresh token')
      }
   }

   async logout(userId: string): Promise<void> {
      // Remove refresh token from database
      await this.repository.updateRefreshToken(userId, null)
   }
}
