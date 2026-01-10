import { llmClient } from '../llm/client'
import { pineconeClient } from '../utils/pinecone'

export class ChatService {
   constructor() {}

   async processChat(message: string): Promise<{ response: string; id?: string }> {
      // 1. Embed user message (512 dimensions to match index)
      const embeddings = await llmClient.generateEmbeddings(message, 'text-embedding-3-small', 512)
      const queryVector = embeddings[0] as number[]

      // 2. Query Pinecone for relevant context
      const indexName = process.env.PINECONE_INDEX || 'cyber-security'
      const matches = await pineconeClient.queryVectors(indexName, queryVector, 5)
      // 3. Construct context string from matches
      const context = matches
         .map((match) => (match.metadata?.content as string) || '')
         .filter((content) => content && content.length > 0)
         .join('\n\n---\n\n')

      // 4. Generate response from LLM using the retrieved context
      const prompt = `
Context from documents:
${context}

User Question: ${message}

Answer the question based strictly on the provided context. If the answer is not in the context, say you don't know based on the documents.
`
      console.log(prompt)

      const responseText = await llmClient.generateResponse({
         prompt: prompt,
      })

      return {
         response: responseText,
      }
   }

   async *processChatStream(message: string) {
      // 1. Embed user message
      const embeddings = await llmClient.generateEmbeddings(message, 'text-embedding-3-small', 512)
      const queryVector = embeddings[0] as number[]

      // 2. Query Pinecone
      const indexName = process.env.PINECONE_INDEX || 'cyber-security'
      const matches = await pineconeClient.queryVectors(indexName, queryVector, 5)

      // 3. Construct context
      const context = matches
         .map((match) => (match.metadata?.content as string) || '')
         .filter((content) => content && content.length > 0)
         .join('\n\n---\n\n')

      // 4. Construct prompt
      const prompt = `
Context from documents:
${context}

User Question: ${message}

Answer the question based strictly on the provided context. If the answer is not in the context, say you don't know based on the documents.
`

      // 5. Yield from LLM stream
      yield* llmClient.generateResponseStream({ prompt })
   }
}
