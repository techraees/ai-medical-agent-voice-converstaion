import OpenAI from 'openai'

const openAIClient = new OpenAI({
   apiKey: process.env.OPENAI_API_KEY,
})

type GenerateResponseOptions = {
   prompt: string
   model?: string
   temperature?: number
   maxTokens?: number
}

export const llmClient = {
   async generateResponse({
      prompt,
      model = 'gpt-4o',
      temperature = 0.7,
      maxTokens = 500,
   }: GenerateResponseOptions): Promise<string> {
      try {
         const response = await openAIClient.chat.completions.create({
            model,
            messages: [
               {
                  role: 'system',
                  content:
                     'You are a Cyber Security RAG System assistant. Answer questions related to cyber security, vulnerabilities, and threats.',
               },
               {
                  role: 'user',
                  content: prompt,
               },
            ],
            temperature,
            max_tokens: maxTokens,
         })

         return response.choices[0]?.message?.content || 'No response generated.'
      } catch (error) {
         console.error('LLM Generation Error:', error)
         throw new Error('Failed to generate response from LLM')
      }
   },

   async *generateResponseStream({
      prompt,
      model = 'gpt-4o',
      temperature = 0.7,
      maxTokens = 1000,
   }: GenerateResponseOptions) {
      try {
         const stream = await openAIClient.chat.completions.create({
            model,
            messages: [
               {
                  role: 'system',
                  content:
                     'You are a Cyber Security RAG System assistant. Answer questions related to cyber security, vulnerabilities, and threats.',
               },
               {
                  role: 'user',
                  content: prompt,
               },
            ],
            temperature,
            max_tokens: maxTokens,
            stream: true,
         })

         for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content || ''
            if (content) yield content
         }
      } catch (error) {
         console.error('LLM Stream Error:', error)
         throw new Error('Failed to generate streaming response from LLM')
      }
   },

   async generateEmbeddings(
      input: string | string[],
      model: string = 'text-embedding-3-small',
      dimensions?: number
   ): Promise<number[][]> {
      try {
         const response = await openAIClient.embeddings.create({
            model,
            input,
            dimensions,
         })

         return response.data.map((item) => item.embedding)
      } catch (error) {
         console.error('Embeddings Generation Error:', error)
         throw new Error('Failed to generate embeddings from OpenAI')
      }
   },
}
