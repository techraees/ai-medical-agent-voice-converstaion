// utils/pdf-parser.ts
import { PDFParse } from 'pdf-parse'

export const extractTextFromPdf = async (buffer: Buffer): Promise<string> => {
   try {
      // Create parser instance with the PDF buffer
      const parser = new PDFParse({ data: buffer })

      // Extract text
      const result = await parser.getText()

      // Free memory
      await parser.destroy()

      return result.text
   } catch (error) {
      console.error('Error extracting text from PDF:', error)
      throw new Error('Failed to extract text from PDF')
   }
}
