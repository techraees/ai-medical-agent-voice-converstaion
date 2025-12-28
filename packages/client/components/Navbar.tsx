'use client'

import { Button } from '@/components/ui/button'
import { Heart } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function Navbar() {
   const pathname = usePathname()

   const navItems = [
      { href: '/', label: 'PP' },
      { href: '/medical-consultant-agent', label: 'MCA' },
   ]

   return (
      <nav className="border-b bg-background/95 backdrop-blur">
         <div className="container mx-auto flex h-16 items-center justify-between px-4">
            <div className="flex items-center gap-2">
               <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
                     <Heart className="h-5 w-5" />
                  </div>
                  <span className="text-xl font-bold text-primary">
                     Rana Raees - <span className="text-sm font-semibold">Senior Software Engineer</span>
                  </span>
               </div>
            </div>

            <div className="flex items-center gap-1">
               {navItems.map((item) => {
                  const isActive = pathname === item.href
                  return (
                     <Link key={item.href} href={item.href}>
                        <Button variant={isActive ? 'default' : 'ghost'} className="gap-2">
                           {item.label}
                        </Button>
                     </Link>
                  )
               })}
            </div>
         </div>
      </nav>
   )
}
