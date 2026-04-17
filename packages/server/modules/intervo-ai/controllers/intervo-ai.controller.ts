import type { Request, Response } from 'express'
import { IntervoAIService } from '../services/intervo-ai.service'

export class IntervoAIController {
   private intervoAIService: IntervoAIService

   constructor() {
      this.intervoAIService = new IntervoAIService()
   }

   getHealth = async (req: Request, res: Response) => {
      try {
         const health = await this.intervoAIService.getHealth()
         res.json(health)
      } catch (error: any) {
         res.status(500).json({ error: error.message })
      }
   }

   startSession = async (req: Request, res: Response) => {
      try {
         const { topic, region, userId, questionCount } = req.body
         const session = await this.intervoAIService.startSession(topic, region, userId, questionCount)
         res.status(201).json(session)
      } catch (error: any) {
         res.status(500).json({ error: error.message })
      }
   }

   submitAnswer = async (req: Request, res: Response) => {
      try {
         const { sessionId, answer } = req.body
         const result = await this.intervoAIService.submitAnswer(sessionId, answer)
         res.json(result)
      } catch (error: any) {
         res.status(500).json({ error: error.message })
      }
   }

   getFeedback = async (req: Request, res: Response) => {
      try {
         const { sessionId } = req.params
         if (!sessionId) {
            res.status(400).json({ error: 'Session ID is required' })
            return
         }
         const feedback = await this.intervoAIService.getFeedback(sessionId)
         res.json(feedback)
      } catch (error: any) {
         res.status(500).json({ error: error.message })
      }
   }

   getHistory = async (req: Request, res: Response) => {
      try {
         const { userId } = req.query
         const history = await this.intervoAIService.getHistory(userId as string)
         res.json(history)
      } catch (error: any) {
         res.status(500).json({ error: error.message })
      }
   }

   getSessionDetails = async (req: Request, res: Response) => {
      try {
         const { sessionId } = req.params
         if (!sessionId) {
            res.status(400).json({ error: 'Session ID is required' })
            return
         }
         const details = await this.intervoAIService.getSessionDetails(sessionId)
         res.json(details)
      } catch (error: any) {
         res.status(500).json({ error: error.message })
      }
   }

   generateSpeech = async (req: Request, res: Response) => {
      try {
         const { text } = req.body
         if (!text) {
            res.status(400).json({ error: 'Text is required' })
            return
         }
         const audioBuffer = await this.intervoAIService.generateSpeech(text)
         res.set({
            'Content-Type': 'audio/mpeg',
            'Content-Length': audioBuffer.length,
         })
         res.send(audioBuffer)
      } catch (error: any) {
         res.status(500).json({ error: error.message })
      }
   }
}
