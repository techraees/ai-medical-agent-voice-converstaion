import { Pinecone } from '@pinecone-database/pinecone'

const pinecone = new Pinecone({
   apiKey: process.env.PINECONE_API_KEY!,
})

export const pineconeClient = {
   async getIndex(indexName: string) {
      // Explicitly get index host to avoid discovery issues in some environments
      const description = await pinecone.describeIndex(indexName)
      if (!description.host) {
         throw new Error(`Index host for ${indexName} not found`)
      }
      return pinecone.index(indexName, description.host)
   },

   async upsertVectors(indexName: string, vectors: { id: string; values: number[]; metadata?: any }[]) {
      try {
         const index = await this.getIndex(indexName)
         await index.upsert(vectors)
         return true
      } catch (error) {
         console.error('Pinecone Upsert Error:', error)
         throw new Error('Failed to upsert vectors to Pinecone')
      }
   },

   async queryVectors(indexName: string, vector: number[], topK: number = 5, includeMetadata: boolean = true) {
      try {
         const index = await this.getIndex(indexName)
         const response = await index.query({
            vector,
            topK,
            includeMetadata,
         })
         return response.matches
      } catch (error) {
         console.error('Pinecone Query Error:', error)
         throw new Error('Failed to query vectors from Pinecone')
      }
   },
}
