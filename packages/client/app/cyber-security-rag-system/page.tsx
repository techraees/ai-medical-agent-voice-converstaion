'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Send, ShieldCheck, Loader2 } from 'lucide-react'

interface Message {
   role: 'user' | 'assistant'
   content: string
}

export default function CyberSecurityPage() {
   const [messages, setMessages] = useState<Message[]>([])
   const [inputValue, setInputValue] = useState('')
   const [isLoading, setIsLoading] = useState(false)
   const [isIngesting, setIsIngesting] = useState(false)

   const scrollRef = useRef<HTMLDivElement>(null)

   // Auto-scroll to bottom when messages change
   useEffect(() => {
      if (scrollRef.current) {
         scrollRef.current.scrollTop = scrollRef.current.scrollHeight
      }
   }, [messages])

   const API_BASE = 'http://localhost:5000/api/cyber-security-rag-system/chat'

   const handleIngest = async () => {
      setIsIngesting(true)
      try {
         const response = await fetch(`${API_BASE}/ingest`, {
            method: 'POST',
         })
         const data = await response.json()
         if (data.success) {
            alert(`Success: ${data.message}`)
         } else {
            alert(`Error: ${data.message}`)
         }
      } catch (error) {
         console.error('Ingestion error:', error)
         alert('Failed to connect to server for ingestion.')
      } finally {
         setIsIngesting(false)
      }
   }

   const handleSendMessage = async () => {
      if (!inputValue.trim() || isLoading) return

      const userMessage = inputValue.trim()
      setMessages((prev) => [...prev, { role: 'user', content: userMessage }])
      setInputValue('')
      setIsLoading(true)

      // Add a placeholder assistant message that we will update
      setMessages((prev) => [...prev, { role: 'assistant', content: '' }])

      try {
         const response = await fetch(API_BASE, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: userMessage }),
         })

         if (!response.ok) throw new Error('Failed to connect to server')

         const reader = response.body?.getReader()
         const decoder = new TextDecoder()
         let accumulatedResponse = ''

         if (reader) {
            while (true) {
               const { done, value } = await reader.read()
               if (done) break

               const chunk = decoder.decode(value, { stream: true })
               accumulatedResponse += chunk

               // Update the last message (the assistant's placeholder)
               setMessages((prev) => {
                  const newMessages = [...prev]
                  newMessages[newMessages.length - 1] = {
                     role: 'assistant',
                     content: accumulatedResponse,
                  }
                  return newMessages
               })
            }
         }
      } catch (error) {
         console.error('Error sending message:', error)
         setMessages((prev) => {
            const newMessages = [...prev]
            newMessages[newMessages.length - 1] = {
               role: 'assistant',
               content: 'Error: Could not connect to the server or stream failed.',
            }
            return newMessages
         })
      } finally {
         setIsLoading(false)
      }
   }

   return (
      <div className="container mx-auto py-10 px-4 max-w-4xl">
         <Card className="h-[80vh] flex flex-col">
            <CardHeader className="border-b">
               <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                     <div className="p-2 bg-primary/10 rounded-lg">
                        <ShieldCheck className="w-8 h-8 text-primary" />
                     </div>
                     <div>
                        <CardTitle>Cyber Security RAG System</CardTitle>
                        <CardDescription>Consultant for Pakistan's Cyber Security Laws</CardDescription>
                     </div>
                  </div>
                  <Button variant="outline" size="sm" onClick={handleIngest} disabled={isIngesting} className="gap-2">
                     {isIngesting ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
                     {isIngesting ? 'Ingesting...' : 'Sync Policy PDF'}
                  </Button>
               </div>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col p-4 overflow-hidden">
               <div ref={scrollRef} className="flex-1 pr-4 mb-4 overflow-y-auto scroll-smooth">
                  <div className="space-y-4">
                     {messages.length === 0 && (
                        <div className="text-center text-muted-foreground mt-10">
                           <p>Ask a question about Cyber Security Laws.</p>
                           <p className="text-sm mt-2 opacity-70">
                              (Make sure to Sync Policy PDF first if you haven't){' '}
                           </p>
                        </div>
                     )}
                     {messages.map((msg, index) => (
                        <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                           <div
                              className={`max-w-[80%] rounded-lg px-4 py-2 ${
                                 msg.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'
                              }`}
                           >
                              <p className="whitespace-pre-wrap">{msg.content}</p>
                           </div>
                        </div>
                     ))}
                     {isLoading && (
                        <div className="flex justify-start">
                           <div className="bg-muted rounded-lg px-4 py-2 flex items-center gap-2">
                              <Loader2 className="w-4 h-4 animate-spin" />
                              <span className="text-sm">Analyzing Policy and generating response...</span>
                           </div>
                        </div>
                     )}
                  </div>
               </div>

               <div className="flex gap-2 pt-2 border-t mt-auto">
                  <Input
                     placeholder="Type your question here about the NCSP 2021..."
                     value={inputValue}
                     onChange={(e) => setInputValue(e.target.value)}
                     onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                     disabled={isLoading}
                  />
                  <Button onClick={handleSendMessage} disabled={isLoading || !inputValue.trim()}>
                     <Send className="w-4 h-4" />
                     <span className="sr-only">Send</span>
                  </Button>
               </div>
            </CardContent>
         </Card>
      </div>
   )
}
