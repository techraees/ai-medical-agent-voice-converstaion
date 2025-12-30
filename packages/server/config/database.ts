import mongoose from 'mongoose'

export const connectDatabase = async () => {
   try {
      const mongoUri = process.env.MONGODB_URI

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
