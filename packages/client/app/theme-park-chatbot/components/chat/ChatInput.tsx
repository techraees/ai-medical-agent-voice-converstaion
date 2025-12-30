import React from 'react'
import type { KeyboardEvent } from 'react'
import { Button } from '../ui/button'
import { FaArrowUp } from 'react-icons/fa'
import { useForm } from 'react-hook-form'

export type ChatFormData = {
   prompt: string
}

type Props = {
   onSubmit: (data: ChatFormData) => void
}

const ChatInput = ({ onSubmit }: Props) => {
   const methods = useForm<ChatFormData>()
   const { register, handleSubmit, formState, reset } = methods

   const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
         e.preventDefault()
         submit()
      }
   }

   const submit = handleSubmit((data: ChatFormData) => {
      reset({
         prompt: '',
      })
      onSubmit(data)
   })
   return (
      <form onSubmit={submit} className="flex flex-col items-end p-4 border-2 rounded-3xl">
         <textarea
            {...register('prompt', {
               required: true,
               validate: (value) => value.trim().length > 0,
            })}
            autoFocus
            onKeyDown={handleKeyDown}
            className="w-full border-0 focus:outline-none resize-none"
            placeholder="Ask about tickets, pricing, hotels, park info..."
            maxLength={1000}
         />
         <Button disabled={!formState.isValid} className="rounded-full w-9 h-9">
            <FaArrowUp />
         </Button>
      </form>
   )
}

export default ChatInput
