import { useEffect, useRef } from 'react'
import ReactMarkdown from 'react-markdown'

export type Message = {
   role: 'user' | 'bot'
   content: string
}

type Props = {
   messages: Message[]
}

const ChatMessages = ({ messages }: Props) => {
   const lastMessageRef = useRef<HTMLDivElement | null>(null)

   useEffect(() => {
      lastMessageRef.current?.scrollIntoView({ behavior: 'smooth' })
   }, [messages])

   const onCopyMessage = (e: React.ClipboardEvent<HTMLParagraphElement>) => {
      const selection = window.getSelection()?.toString()?.trim()
      if (selection) {
         e.preventDefault()
         e.clipboardData.setData('text/plain', selection)
      }
   }
   return (
      <div className="flex flex-col gap-3">
         {messages.map((message: Message, index: number) => (
            <div
               key={index}
               onCopy={onCopyMessage}
               ref={lastMessageRef}
               className={`px-3 py-1 rounded-xl w-fit max-w-md ${
                  message.role === 'user' ? 'bg-blue-500 text-white self-end' : 'bg-gray-200 text-black self-start'
               }`}
            >
               <ReactMarkdown>{message.content}</ReactMarkdown>
            </div>
         ))}
      </div>
   )
}

export default ChatMessages
