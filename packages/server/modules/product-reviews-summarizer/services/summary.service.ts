import OpenAI from 'openai'

const client = new OpenAI({
   apiKey: process.env.OPENAI_API_KEY,
})

export const summaryService = {
   async summarizeReviews(reviews: string): Promise<string> {
      const completion = await client.chat.completions.create({
         model: 'gpt-4o-mini',
         messages: [
            {
               role: 'system',
               content: `You are an expert product review analyst. 
               Your task is to analyze the provided product reviews and create a comprehensive summary.
               
               Please include:
               1. Overall Sentiment (Positive/Neutral/Negative with approx percentage)
               2. Key Pros (Bulleted list)
               3. Key Cons (Bulleted list)
               4. Final Verdict (Concise paragraph)
               
               Format the output in clean Markdown.`,
            },
            {
               role: 'user',
               content: `Here are the product reviews to analyze:\n\n${reviews}`,
            },
         ],
         temperature: 0.3,
         max_tokens: 1000,
      })

      return completion.choices[0]?.message?.content || 'Failed to generate summary.'
   },
}
