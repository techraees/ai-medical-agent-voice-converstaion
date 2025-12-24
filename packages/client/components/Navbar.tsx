'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Heart, History, Home, CreditCard, User } from 'lucide-react'

export function Navbar() {
   const pathname = usePathname()

   const navItems = [
      { href: '/', label: 'Home', icon: Home },
      { href: '/history', label: 'History', icon: History },
      { href: '/pricing', label: 'Pricing', icon: CreditCard },
      { href: '/profile', label: 'Profile', icon: User },
   ]

   return (
      <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
         <div className="container mx-auto flex h-16 items-center justify-between px-4">
            <div className="flex items-center gap-2">
               <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
                     <Heart className="h-5 w-5" />
                  </div>
                  <span className="text-xl font-bold text-primary">MediVoice AI</span>
               </div>
            </div>

            <div className="flex items-center gap-1">
               {navItems.map((item) => {
                  const Icon = item.icon
                  const isActive = pathname === item.href
                  return (
                     <Link key={item.href} href={item.href}>
                        <Button variant={isActive ? 'default' : 'ghost'} className="gap-2">
                           <Icon className="h-4 w-4" />
                           {item.label}
                        </Button>
                     </Link>
                  )
               })}
            </div>

            <div className="flex items-center gap-4">
               <Avatar>
                  <AvatarImage src="/avatar.png" alt="User" />
                  <AvatarFallback>U</AvatarFallback>
               </Avatar>
            </div>
         </div>
      </nav>
   )
}
