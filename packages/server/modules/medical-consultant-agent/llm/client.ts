import { InferenceClient } from '@huggingface/inference'
import { Ollama } from 'ollama'
import OpenAI from 'openai'
import summarizePrompt from '../llm/prompts/summarize-reviews.txt'

const openAIClient = new OpenAI({
   apiKey: process.env.OPENAI_API_KEY,
})

const inferenceClient = new InferenceClient(process.env.HF_TOKEN)

const ollamaClient = new Ollama()

type GenerateTextOptions = {
   model?: string
   prompt: string
   instructions?: string
   temperature?: number
   maxTokens?: number
   previousResponseId?: string
}

type GenerateTextResult = {
   id: string
   text: string
}

type SuggestedDoctorsOptions = {
   model?: string
   prompt: string
   instructions?: string
   temperature?: number
   maxTokens?: number
   previousResponseId?: string
   listOfDoctors?: string
}

export const llmClient = {
   async generateText({
      model = 'gpt-4.1',
      prompt,
      instructions,
      temperature = 0.2,
      maxTokens = 300,
      previousResponseId,
   }: GenerateTextOptions): Promise<GenerateTextResult> {
      const response = await openAIClient.responses.create({
         model,
         input: prompt,
         instructions,
         temperature,
         max_output_tokens: maxTokens,
         previous_response_id: previousResponseId,
      })

      return {
         id: response.id,
         text: response.output_text,
      }
   },

   async getSuggestedDoctors({
      model = 'gpt-4.1',
      prompt,
      listOfDoctors,
      temperature = 0.7,
   }: SuggestedDoctorsOptions): Promise<any> {
      const response = await openAIClient.responses.create({
         model,
         temperature,
         max_output_tokens: 1000,
         instructions: 'Return ONLY valid JSON.',
         input: [
            {
               role: 'system',
               content: `
You are a medical assistant.
You will be given a list of doctors in JSON format.

Each doctor follows this structure:
{
  "id": number,
  "specialist": string,
  "description": string,
  "image": string,
  "agentPrompt": string,
  "voiceId": string,
  "subscriptionRequired": boolean
}

Based on the user's prompt, filter and return only the relevant doctors.

Rules:
- Return ONLY valid JSON.
- The response must be an array of objects.
- Each object must strictly follow the provided structure.
- Do NOT add, remove, or rename any properties.
- Do NOT include explanations, comments, or extra text.

Here is the doctors list in JSON format: where you need to extract based on user prompt:
${listOfDoctors}
\n\n
`,
            },
            {
               role: 'user',
               content: `User Notes/Symptoms: \n\n ${prompt} \n\n. Depend on user notes/symptoms, return only the relevant or suuggested  doctors.`,
            },
         ],
      })

      return response.output_text
   },
}
