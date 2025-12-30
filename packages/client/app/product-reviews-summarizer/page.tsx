'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { useState } from 'react'
import ReactMarkdown from 'react-markdown'

export default function ProductReviewsSummarizer() {
   const [reviews, setReviews] = useState('')
   const [summary, setSummary] = useState('')
   const [isLoading, setIsLoading] = useState(false)

   const handleSummarize = async () => {
      if (!reviews.trim()) return

      setIsLoading(true)
      setSummary('')

      try {
         const response = await fetch('/api/product-reviews-summarizer/summarize', {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json',
            },
            body: JSON.stringify({ reviews }),
         })

         if (!response.ok) {
            const errorData = await response.json()
            throw new Error(errorData.message || 'Failed to generate summary')
         }

         const data = await response.json()
         setSummary(data.summary)
      } catch (error) {
         console.error('Error summarizign reviews:', error)
         setSummary('Error: Failed to generate summary. Please try again.')
      } finally {
         setIsLoading(false)
      }
   }

   return (
      <div className="container mx-auto py-10 max-w-4xl">
         <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
               <h1 className="text-3xl font-bold tracking-tight">Product Reviews Summarizer</h1>
               <p className="text-muted-foreground">
                  Paste your product reviews below to get a comprehensive summary and sentiment analysis.
               </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
               <Card className="h-full">
                  <CardHeader>
                     <CardTitle>Input Reviews</CardTitle>
                     <CardDescription>Paste one review per line or bulk text</CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-col gap-4">
                     <Textarea
                        placeholder="Paste reviews here..."
                        className="min-h-[300px] resize-none"
                        value={reviews}
                        onChange={(e) => setReviews(e.target.value)}
                     />
                     <Button onClick={handleSummarize} disabled={isLoading || !reviews.trim()}>
                        {isLoading ? 'Summarizing...' : 'Summarize Reviews'}
                     </Button>
                  </CardContent>
               </Card>

               <Card className="h-full">
                  <CardHeader>
                     <CardTitle>Summary Analysis</CardTitle>
                     <CardDescription>AI-generated summary of the reviews</CardDescription>
                  </CardHeader>
                  <CardContent>
                     {summary ? (
                        <div className="prose dark:prose-invert max-w-none">
                           <ReactMarkdown>{summary}</ReactMarkdown>
                        </div>
                     ) : (
                        <div className="flex h-[300px] items-center justify-center text-muted-foreground border-2 border-dashed rounded-lg">
                           Summary will appear here
                        </div>
                     )}
                  </CardContent>
               </Card>
            </div>
         </div>
      </div>
   )
}
