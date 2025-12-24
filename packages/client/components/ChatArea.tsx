'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Send, Phone, PhoneOff } from 'lucide-react'
import { useSendMessageMutation, useGetChatHistoryQuery } from '@/lib/api/apiSlice'

interface ChatAreaProps {
   doctorId: string | null
   doctorName?: string
   doctorImage?: string
}

export function ChatArea({ doctorId, doctorName, doctorImage }: ChatAreaProps) {
   const [message, setMessage] = useState('')
   const [isConnected, setIsConnected] = useState(false)
   const [sendMessage] = useSendMessageMutation()

   const { data: chatHistory = [] } = useGetChatHistoryQuery(doctorId || '', {
      skip: !doctorId,
   })

   const handleSendMessage = async () => {
      if (!message.trim() || !doctorId) return

      try {
         await sendMessage({ doctorId, message: message.trim() }).unwrap()
         setMessage('')
      } catch (error) {
         console.error('Failed to send message:', error)
      }
   }

   const handleConnect = () => {
      setIsConnected(true)
   }

   const handleDisconnect = () => {
      setIsConnected(false)
   }

   if (!doctorId) {
      return (
         <Card className="h-full flex items-center justify-center">
            <CardContent className="text-center text-muted-foreground">
               <p className="text-lg">Select a doctor to start consultation</p>
            </CardContent>
         </Card>
      )
   }

   return (
      <Card className="h-full flex flex-col">
         <CardHeader className="border-b">
            <div className="flex items-center justify-between">
               <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                     <AvatarImage src={doctorImage} alt={doctorName} />
                     <AvatarFallback>{doctorName?.[0] || 'D'}</AvatarFallback>
                  </Avatar>
                  <div>
                     <CardTitle className="text-lg">{doctorName}</CardTitle>
                     <div className="flex items-center gap-2 mt-1">
                        <div className={`h-2 w-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-gray-400'}`} />
                        <span className="text-sm text-muted-foreground">
                           {isConnected ? 'Connected...' : 'Not Connected'}
                        </span>
                     </div>
                  </div>
               </div>
               <div className="flex items-center gap-2">
                  {!isConnected ? (
                     <Button onClick={handleConnect} size="sm" variant="default">
                        <Phone className="h-4 w-4 mr-2" />
                        Connect
                     </Button>
                  ) : (
                     <Button onClick={handleDisconnect} size="sm" variant="destructive">
                        <PhoneOff className="h-4 w-4 mr-2" />
                        Disconnect
                     </Button>
                  )}
               </div>
            </div>
         </CardHeader>

         <CardContent className="flex-1 flex flex-col p-4 overflow-hidden">
            <div className="flex-1 overflow-y-auto space-y-4 mb-4">
               {chatHistory.length === 0 ? (
                  <div className="flex items-center justify-center h-full text-muted-foreground">
                     <div className="text-center">
                        <p className="text-lg mb-2">Start your consultation</p>
                        <p className="text-sm">Send a message to begin chatting with {doctorName}</p>
                     </div>
                  </div>
               ) : (
                  chatHistory.map((msg) => (
                     <div
                        key={msg.id}
                        className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                     >
                        {msg.role === 'assistant' && (
                           <Avatar className="h-8 w-8">
                              <AvatarImage src={doctorImage} alt={doctorName} />
                              <AvatarFallback>{doctorName?.[0] || 'D'}</AvatarFallback>
                           </Avatar>
                        )}
                        <div
                           className={`rounded-lg px-4 py-2 max-w-[70%] ${
                              msg.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'
                           }`}
                        >
                           <p className="text-sm">{msg.content}</p>
                           <p className="text-xs mt-1 opacity-70">{new Date(msg.timestamp).toLocaleTimeString()}</p>
                        </div>
                        {msg.role === 'user' && (
                           <Avatar className="h-8 w-8">
                              <AvatarFallback>U</AvatarFallback>
                           </Avatar>
                        )}
                     </div>
                  ))
               )}
            </div>

            <div className="flex gap-2">
               <Textarea
                  placeholder="Type your message here..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => {
                     if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault()
                        handleSendMessage()
                     }
                  }}
                  className="min-h-[60px] resize-none"
                  disabled={!isConnected}
               />
               <Button onClick={handleSendMessage} disabled={!message.trim() || !isConnected} size="lg">
                  <Send className="h-4 w-4" />
               </Button>
            </div>
         </CardContent>
      </Card>
   )
}
