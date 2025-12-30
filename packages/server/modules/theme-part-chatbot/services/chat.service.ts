import OpenAI from 'openai'
import { conversationRepository } from '../repositories/conversation.repository'
import template from '../prompts/chatbot.txt'
import fs from 'fs'
import path from 'path'

// Implementaion Details
const client = new OpenAI({
   apiKey: process.env.OPENAI_API_KEY,
})

const getParkInfo = fs.readFileSync(path.join(__dirname, '..', 'prompts', 'WonderWorld.md'), 'utf8')
const instructions = template.replace('{{parkInfo}}', getParkInfo)

type ChatResponse = {
   id: string
   message: string
}

// Export Public Interface
// Leaky Abstraction: Returns the raw response object instead of the output text
export const chatService = {
   async sendMessage(prompt: string, conversationId: string): Promise<ChatResponse> {
      const previousResponseId = conversationRepository.getLastResponseId(conversationId)

      const requestParams: any = {
         instructions: instructions,
         model: 'gpt-4o-mini',
         temperature: 0.2,
         max_output_tokens: 200,
         input: prompt,
      }

      // Only add previous_response_id if it exists (for continuing conversations)
      if (previousResponseId) {
         requestParams.previous_response_id = previousResponseId
      }

      const response = await client.responses.create(requestParams)

      conversationRepository.setLastResponseId(conversationId, response.id)

      return {
         id: response.id,
         message: response.output_text,
      }
   },
}
