import type { Request, Response } from 'express'
import { AuthService } from '../services/auth.service'

export class AuthController {
   private service: AuthService

   constructor() {
      this.service = new AuthService()
   }

   register = async (req: Request, res: Response): Promise<void> => {
      try {
         const { email, password, name, role, phone } = req.body

         if (!email || !password || !name) {
            res.status(400).json({
               success: false,
               message: 'Email, password, and name are required',
            })
            return
         }

         const result = await this.service.register({
            email,
            password,
            name,
            role,
            phone,
         })

         res.status(201).json({
            success: true,
            message: 'User registered successfully',
            data: result,
         })
      } catch (error: any) {
         res.status(400).json({ success: false, message: error.message })
      }
   }

   login = async (req: Request, res: Response): Promise<void> => {
      try {
         const { email, password } = req.body

         if (!email || !password) {
            res.status(400).json({
               success: false,
               message: 'Email and password are required',
            })
            return
         }

         const result = await this.service.login({ email, password })

         res.status(200).json({
            success: true,
            message: 'Login successful',
            data: result,
         })
      } catch (error: any) {
         res.status(401).json({ success: false, message: error.message })
      }
   }

   refreshToken = async (req: Request, res: Response): Promise<void> => {
      try {
         const { refreshToken } = req.body

         if (!refreshToken) {
            res.status(400).json({
               success: false,
               message: 'Refresh token is required',
            })
            return
         }

         const result = await this.service.refreshToken(refreshToken)

         res.status(200).json({
            success: true,
            message: 'Token refreshed successfully',
            data: result,
         })
      } catch (error: any) {
         res.status(401).json({ success: false, message: error.message })
      }
   }

   logout = async (req: Request, res: Response): Promise<void> => {
      try {
         const userId = (req as any).user?.userId
         if (!userId) {
            res.status(401).json({ success: false, message: 'Unauthorized' })
            return
         }

         await this.service.logout(userId)

         res.status(200).json({
            success: true,
            message: 'Logout successful',
         })
      } catch (error: any) {
         res.status(500).json({ success: false, message: error.message })
      }
   }
}
