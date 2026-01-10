import type { Request, Response } from 'express'
import { promises as fs } from 'fs'
import { ChatService } from '../services/chat.service'
import { nationalCyberSecurityPolicyPath } from '../documents'
import { extractTextFromPdf } from '../utils/pdf-parser.ts'
import { recursiveChunkText } from '../utils/text-chunker'
import { llmClient } from '../llm/client'
import { pineconeClient } from '../utils/pinecone'

export class ChatController {
   private service: ChatService

   constructor() {
      this.service = new ChatService()
   }

   ingest = async (req: Request, res: Response): Promise<void> => {
      try {
         const pdfBuffer = await fs.readFile(nationalCyberSecurityPolicyPath)
         const text = await extractTextFromPdf(pdfBuffer)

         const chunks = recursiveChunkText(text, { chunkSize: 500, chunkOverlap: 100 })

         // Generate embeddings for the chunks with 512 dimensions to match Pinecone index
         const embeddings = await llmClient.generateEmbeddings(chunks, 'text-embedding-3-small', 512)

         // Prepare vectors for Pinecone
         const vectors = chunks.map((content, index) => ({
            id: `chunk-${Date.now()}-${index}`,
            values: embeddings[index] as number[],
            metadata: {
               content,
               source: 'national-cyber-security-policy',
            },
         }))

         // Upsert to Pinecone
         const indexName = process.env.PINECONE_INDEX || 'cyber-security'
         await pineconeClient.upsertVectors(indexName, vectors)

         res.status(200).json({
            success: true,
            message: `Successfully processed and stored ${chunks.length} chunks in Pinecone`,
            count: chunks.length,
         })
      } catch (error: any) {
         console.error('Error in ingest controller:', error)
         res.status(500).json({ success: false, message: error.message })
      }
   }

   chat = async (req: Request, res: Response): Promise<void> => {
      try {
         const { message } = req.body
         if (!message) {
            res.status(400).json({ success: false, message: 'Message is required' })
            return
         }

         // Set headers for streaming
         res.setHeader('Content-Type', 'text/event-stream')
         res.setHeader('Cache-Control', 'no-cache')
         res.setHeader('Connection', 'keep-alive')

         const stream = this.service.processChatStream(message)

         for await (const chunk of stream) {
            res.write(chunk)
         }

         res.end()
      } catch (error: any) {
         console.error('Error in chat controller:', error)
         if (!res.headersSent) {
            res.status(500).json({ success: false, message: error.message })
         } else {
            res.end()
         }
      }
   }
}
