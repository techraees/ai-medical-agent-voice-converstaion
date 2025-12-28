import { Request, Response, NextFunction } from 'express'
import { verifyAccessToken } from '../utils/auth.utils'
import { UserRepository } from '../repositories/user.repository'

export interface AuthRequest extends Request {
   user?: {
      userId: string
      email: string
      role: string
   }
}

export const authenticate = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
   try {
      const authHeader = req.headers.authorization

      if (!authHeader || !authHeader.startsWith('Bearer ')) {
         res.status(401).json({ success: false, message: 'No token provided' })
         return
      }

      const token = authHeader.substring(7) // Remove 'Bearer ' prefix

      // Verify token
      const decoded = verifyAccessToken(token)

      // Verify user still exists and is active
      const userRepository = new UserRepository()
      const user = await userRepository.findByEmail(decoded.email)

      if (!user || !user.isActive) {
         res.status(401).json({ success: false, message: 'User not found or inactive' })
         return
      }

      // Attach user info to request
      req.user = {
         userId: decoded.userId,
         email: decoded.email,
         role: decoded.role,
      }

      next()
   } catch (error: any) {
      res.status(401).json({ success: false, message: 'Invalid or expired token' })
   }
}

export const authorize = (...roles: string[]) => {
   return (req: AuthRequest, res: Response, next: NextFunction): void => {
      if (!req.user) {
         res.status(401).json({ success: false, message: 'Unauthorized' })
         return
      }

      if (!roles.includes(req.user.role)) {
         res.status(403).json({
            success: false,
            message: 'Access denied. Insufficient permissions',
         })
         return
      }

      next()
   }
}
