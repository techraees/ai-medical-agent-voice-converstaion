import { prisma } from './lib/prisma'

async function main() {
   try {
      console.log('Environment Check:')
      console.log('DATABASE_URL:', !!process.env.DATABASE_URL)
      console.log('DATABASE_HOST:', !!process.env.DATABASE_HOST)
      console.log('DATABASE_USER:', !!process.env.DATABASE_USER)
      console.log('DATABASE_PASSWORD:', !!process.env.DATABASE_PASSWORD)
      console.log('DATABASE_NAME:', !!process.env.DATABASE_NAME)

      console.log('Connecting to database...')
      const reviews = await prisma.review.findMany()
      console.log('Successfully connected!')
      console.log('Reviews count:', reviews.length)
   } catch (e: any) {
      console.error('Connection failed details:', e.message || e)
      process.exit(1)
   } finally {
      await prisma.$disconnect()
   }
}

main()
