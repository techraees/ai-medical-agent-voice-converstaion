import { Request, Response } from 'express'
import { UserService } from '../services/user.service'

export class UserController {
   private service: UserService

   constructor() {
      this.service = new UserService()
   }

   getById = async (req: Request, res: Response): Promise<void> => {
      try {
         const { id } = req.params
         const user = await this.service.getUserById(id)
         if (!user) {
            res.status(404).json({ success: false, message: 'User not found' })
            return
         }
         res.status(200).json({ success: true, data: user })
      } catch (error: any) {
         res.status(500).json({ success: false, message: error.message })
      }
   }

   getAll = async (req: Request, res: Response): Promise<void> => {
      try {
         const page = parseInt(req.query.page as string) || 1
         const limit = parseInt(req.query.limit as string) || 10
         const result = await this.service.getAllUsers({ page, limit })
         res.status(200).json({ success: true, ...result })
      } catch (error: any) {
         res.status(500).json({ success: false, message: error.message })
      }
   }

   getByRole = async (req: Request, res: Response): Promise<void> => {
      try {
         const { role } = req.params
         const page = parseInt(req.query.page as string) || 1
         const limit = parseInt(req.query.limit as string) || 10
         const result = await this.service.getUsersByRole(role as any, { page, limit })
         res.status(200).json({ success: true, ...result })
      } catch (error: any) {
         res.status(500).json({ success: false, message: error.message })
      }
   }

   update = async (req: Request, res: Response): Promise<void> => {
      try {
         const { id } = req.params
         const user = await this.service.updateUser(id, req.body)
         if (!user) {
            res.status(404).json({ success: false, message: 'User not found' })
            return
         }
         res.status(200).json({ success: true, data: user })
      } catch (error: any) {
         res.status(400).json({ success: false, message: error.message })
      }
   }

   updateRole = async (req: Request, res: Response): Promise<void> => {
      try {
         const { id } = req.params
         const { role } = req.body
         if (!role || !['user', 'consultant', 'doctor', 'admin'].includes(role)) {
            res.status(400).json({ success: false, message: 'Invalid role' })
            return
         }
         const user = await this.service.updateUserRole(id, role)
         if (!user) {
            res.status(404).json({ success: false, message: 'User not found' })
            return
         }
         res.status(200).json({ success: true, data: user })
      } catch (error: any) {
         res.status(400).json({ success: false, message: error.message })
      }
   }

   delete = async (req: Request, res: Response): Promise<void> => {
      try {
         const { id } = req.params
         const deleted = await this.service.deleteUser(id)
         if (!deleted) {
            res.status(404).json({ success: false, message: 'User not found' })
            return
         }
         res.status(200).json({ success: true, message: 'User deleted successfully' })
      } catch (error: any) {
         res.status(500).json({ success: false, message: error.message })
      }
   }
}
