'use client'

import Chatbot from './components/chat/Chatbot'
import { useSelector } from 'react-redux'
import type { RootState } from '@/lib/store'

function ThemeParkChatBot() {
   const navbarHeight = useSelector((state: RootState) => state.navbar.height)
   const calculatedHeight = `calc(100vh - ${navbarHeight}px)`

   return (
      <div style={{ height: calculatedHeight }} className="p-4 w-full">
         <Chatbot />
      </div>
   )
}

export default ThemeParkChatBot
