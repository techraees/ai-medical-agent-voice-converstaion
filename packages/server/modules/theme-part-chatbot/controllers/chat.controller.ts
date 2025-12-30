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

   async sendMessageStream(req: Request, res: Response) {
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

      res.setHeader('Content-Type', 'text/event-stream')
      res.setHeader('Cache-Control', 'no-cache')
      res.setHeader('Connection', 'keep-alive')
      res.flushHeaders()

      try {
         const { prompt, conversationId } = req.body

         await chatService.sendMessageStream(prompt, conversationId, (chunk) => {
            // Safely serialize the chunk to avoid SSE protocol errors with newlines
            res.write(`data: ${JSON.stringify(chunk)}\n\n`)
         })

         res.write(`event: end\ndata: "done"\n\n`)
         res.end()
      } catch (error) {
         res.write(`event: error\ndata: "failed"\n\n`)
         res.end()
         // Handle other unexpected errors
         return res.status(500).json({
            error: 'Internal server error',
            message: error instanceof Error ? error.message : 'An unknown error occurred',
         })
      }
   },
}
