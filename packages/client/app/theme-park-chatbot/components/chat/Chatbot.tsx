'use client'
import axios from 'axios'
import { useRef, useState } from 'react'
import ChatInput, { type ChatFormData } from './ChatInput'
import type { Message } from './ChatMessages'
import ChatMessages from './ChatMessages'
import TypingIndicator from './TypingIndicator'

// Use public folder paths directly (no imports needed in Next.js)
const popSound = '/theme-park-chatbot-assets/sounds/pop.mp3'
const notificationSound = '/theme-park-chatbot-assets/sounds/notification.mp3'

const popAudio = new Audio(popSound)
popAudio.volume = 0.2

const notificationAudio = new Audio(notificationSound)
notificationAudio.volume = 0.2

type ChatResponse = {
   id: string
   message: string
}

const Chatbot = () => {
   const [isBotTyping, setIsBotTyping] = useState<boolean>(false)
   const [messages, setMessages] = useState<Message[]>([])
   const [error, setError] = useState<string | null>(null)
   const conversationId = useRef(crypto.randomUUID())

   const onSubmit = async ({ prompt }: ChatFormData) => {
      try {
         setError(null)
         setMessages((prev) => [...prev, { content: prompt, role: 'user' }])
         setIsBotTyping(true)

         popAudio.play()

         const { data } = await axios.post<ChatResponse>('/api/theme-park-chatbot/chat', {
            prompt,
            conversationId: conversationId.current,
         })

         setMessages((prev) => [...prev, { content: data.message, role: 'bot' }])
         notificationAudio.play()
      } catch (error) {
         console.error('Error sending message:', error)
         setError('Something went wrong. Please try again.')
      } finally {
         setIsBotTyping(false)
      }
   }

   const handleQuickAction = (action: string) => {
      const quickPrompts: Record<string, string> = {
         tickets: 'What are the ticket prices and how can I book tickets?',
         pricing: 'Tell me about the pricing for different ticket types and packages.',
         hotel: 'Can you recommend hotels near the park?',
         park: 'What are the park hours, attractions, and activities available?',
      }
      onSubmit({ prompt: quickPrompts[action] || action })
   }

   return (
      <div className="flex flex-col h-full w-full">
         {/* Header */}
         <div className="mb-4 pb-4 border-b">
            <h2 className="text-2xl font-bold">Theme Park Assistant</h2>
            <p className="text-sm text-muted-foreground">Ask me about tickets, pricing, hotels, or park information</p>
         </div>

         {/* Quick Action Buttons */}
         {messages.length === 0 && (
            <div className="mb-4 flex flex-wrap gap-2">
               <button
                  onClick={() => handleQuickAction('tickets')}
                  className="px-4 py-2 text-sm bg-blue-100 hover:bg-blue-200 rounded-lg transition-colors"
               >
                  🎫 Ticket Booking
               </button>
               <button
                  onClick={() => handleQuickAction('pricing')}
                  className="px-4 py-2 text-sm bg-green-100 hover:bg-green-200 rounded-lg transition-colors"
               >
                  💰 Pricing Info
               </button>
               <button
                  onClick={() => handleQuickAction('hotel')}
                  className="px-4 py-2 text-sm bg-purple-100 hover:bg-purple-200 rounded-lg transition-colors"
               >
                  🏨 Hotels Nearby
               </button>
               <button
                  onClick={() => handleQuickAction('park')}
                  className="px-4 py-2 text-sm bg-orange-100 hover:bg-orange-200 rounded-lg transition-colors"
               >
                  🎢 Park Information
               </button>
            </div>
         )}

         <div className="flex flex-col flex-1 gap-3 mb-10 overflow-y-auto">
            <ChatMessages messages={messages} />
            {isBotTyping && <TypingIndicator />}
            {error && <p className="text-red-500 text-sm">{error}</p>}
         </div>

         <ChatInput onSubmit={onSubmit} />
      </div>
   )
}

export default Chatbot
