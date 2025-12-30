import type { Request, Response } from 'express'
import { summaryService } from '../services/summary.service'
import z from 'zod'

const summarySchema = z.object({
   reviews: z.string().min(10, 'Reviews must be at least 10 characters long').max(50000, 'Reviews text is too long'),
})

export const summaryController = {
   async summarize(req: Request, res: Response) {
      const validationResult = summarySchema.safeParse(req.body)

      if (!validationResult.success) {
         return res.status(400).json({
            error: 'Validation failed',
            details: validationResult.error.issues.map((err) => ({
               field: err.path.join('.'),
               message: err.message,
            })),
         })
      }

      try {
         const { reviews } = validationResult.data
         const summary = await summaryService.summarizeReviews(reviews)

         return res.json({ summary })
      } catch (error) {
         console.error('Error in /summarize:', error)
         return res.status(500).json({
            error: 'Internal server error',
            message: error instanceof Error ? error.message : 'An unknown error occurred',
         })
      }
   },
}
