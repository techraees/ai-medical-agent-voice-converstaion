import mongoose from 'mongoose'

export const connectDatabase = async () => {
   try {
      const mongoUri = process.env.MONGODB_URI

      console.log(mongoUri)
      if (mongoose.connection.readyState >= 1) {
         return
      }

      if (!mongoUri) {
         throw new Error('MONGODB_URI is not defined in environment variables')
      }

      await mongoose.connect(mongoUri)

      console.log(`MongoDB Connected: ${mongoose.connection.host}`)
   } catch (error) {
      console.error('Error connecting to MongoDB:', error)
      process.exit(1)
   }
}

// PINE_CONE_KEY=pcsk_75Esyk_PG6u45ozBfrGLgDr1J8ympRV2Tidavo5SsRXRavuSFNosbhFyvi3sDimts2Fbai
// 34eS0bqealSUhfAO_asda213
// PINE_CONE_KEY=pcsk_75Esyk_PG6u45ozBfrGLgDr1J8ympRV2Tidavo5SsRXRavuSFNosbhFyvi3sDimts2Fbai
// CYBER_SECURITY_RAG_SYSTEM_PROJECT_NAME=cyber-security-rag-system
// OPENAI_API_KEY=pcsk_75Esyk_PG6u45ozBfrGLgDr1J8ympRV2Tidavo5SsRXRavuSFNosbhFyvi3sDimts2Fbai
// MONGODB_URI=mongodb+srv://techraees:34eS0bqealSUhfAO_asda213@cluster0.fr0nk.mongodb.net
