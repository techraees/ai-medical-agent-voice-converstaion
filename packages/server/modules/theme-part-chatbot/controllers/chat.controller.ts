import type { Request, Response } from 'express'
import { chatService } from '../services/chat.service'
import z from 'zod'

// Implementaion Details
const chatSchema = z.object({
   prompt: z.string().trim().min(1, 'Prompt cannot be empty').max(1000, 'Prompt cannot exceed 1000 characters'),
   conversationId: z.string().uuid('Invalid conversation ID format'),
})

// Export Public Interface
export const chatController = {
   async sendMessage(req: Request, res: Response) {
      // Validate request body with zod schema
      const validationResult = chatSchema.safeParse(req.body)

      if (!validationResult.success) {
         return res.status(400).json({
            error: 'Validation failed',
            details: validationResult.error.issues.map((err: z.ZodIssue) => ({
               field: err.path.join('.'),
               message: err.message,
            })),
         })
      }

      try {
         const { prompt, conversationId } = validationResult.data

         const response = await chatService.sendMessage(prompt, conversationId)

         return res.json({ message: response.message })
      } catch (error) {
         console.error('Error in /api/chat:', error)
         // Handle validation errors (shouldn't reach here due to safeParse, but just in case)
         if (error instanceof z.ZodError) {
            return res.status(400).json({
               error: 'Validation failed',
               details: error.issues.map((err: z.ZodIssue) => ({
                  field: err.path.join('.'),
                  message: err.message,
               })),
            })
         }

         // Handle other unexpected errors
         return res.status(500).json({
            error: 'Internal server error',
            message: error instanceof Error ? error.message : 'An unknown error occurred',
         })
      }
   },
}
