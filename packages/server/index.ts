import dotenv from 'dotenv'
import express from 'express'
import router from './routes'
import { connectDatabase } from './config/database'

dotenv.config()

const app = express()
const port = process.env.PORT || 5000

// Middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// CORS Middleware
app.use((req, res, next) => {
   res.header('Access-Control-Allow-Origin', '*')
   res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
   res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
   if (req.method === 'OPTIONS') {
      res.sendStatus(200)
   } else {
      next()
   }
})

// Routes
app.use(router)

// Start server
const startServer = async () => {
   try {
      // Connect to MongoDB
      await connectDatabase()

      // Start Express server
      app.listen(port, () => {
         console.log(`🚀 Server is running on port ${port}`)
      })
   } catch (error) {
      console.error('Failed to start server:', error)
      process.exit(1)
   }
}

startServer()
