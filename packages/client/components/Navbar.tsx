'use client'

import { Button } from '@/components/ui/button'
import { Heart } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { cn } from '@/lib/utils'

interface NavItemHoverContent {
   title: string
   body: string
   footer?: string
   image?: string
   video?: string
}

export function Navbar() {
   const pathname = usePathname()
   const [hoveredItem, setHoveredItem] = useState<string | null>(null)

   const navItems: Array<{
      href: string
      label: string
      hoverContent?: NavItemHoverContent
   }> = [
      {
         href: '/',
         label: 'PP',
         hoverContent: {
            title: 'Personal Portfolio',
            body: 'Explore my professional portfolio showcasing my projects, skills, and experience as a Senior Software Engineer.',
            footer: 'Click to view portfolio',
            image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=300&fit=crop',
         },
      },
      {
         href: '/medical-consultant-agent',
         label: 'MCA',
         hoverContent: {
            title: 'Medical Consultant Agent',
            body: 'AI-powered medical consultation platform with voice conversation capabilities. Get instant medical advice and support.',
            footer: 'Start consultation',
            image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=300&fit=crop',
         },
      },
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
                  const isHovered = hoveredItem === item.href

                  return (
                     <div
                        key={item.href}
                        className="relative"
                        onMouseEnter={() => setHoveredItem(item.href)}
                        onMouseLeave={() => setHoveredItem(null)}
                     >
                        <Link href={item.href}>
                           <Button variant={isActive ? 'default' : 'ghost'} className="gap-2">
                              {item.label}
                           </Button>
                        </Link>

                        {item.hoverContent && isHovered && (
                           <div
                              className="absolute top-full right-0 z-50 mt-1 w-80 animate-in fade-in-0 zoom-in-95 slide-in-from-top-2"
                              onMouseEnter={() => setHoveredItem(item.href)}
                              onMouseLeave={() => setHoveredItem(null)}
                           >
                              <div className="rounded-lg border bg-popover text-popover-foreground shadow-lg">
                                 {/* Title */}
                                 <div className="border-b px-4 py-3">
                                    <h3 className="font-semibold text-sm">{item.hoverContent.title}</h3>
                                 </div>

                                 {/* Body with Image/Video */}
                                 <div className="px-4 py-3">
                                    {item.hoverContent.image && (
                                       <div className="mb-3 overflow-hidden rounded-md">
                                          <img
                                             src={item.hoverContent.image}
                                             alt={item.hoverContent.title}
                                             className="h-40 w-full object-cover"
                                          />
                                       </div>
                                    )}
                                    {item.hoverContent.video && (
                                       <div className="mb-3 overflow-hidden rounded-md">
                                          <video
                                             src={item.hoverContent.video}
                                             className="h-40 w-full object-cover"
                                             controls
                                             muted
                                          />
                                       </div>
                                    )}
                                    <p className="text-sm text-muted-foreground">{item.hoverContent.body}</p>
                                 </div>

                                 {/* Footer */}
                                 {item.hoverContent.footer && (
                                    <div className="border-t bg-muted/50 px-4 py-2">
                                       <p className="text-xs text-muted-foreground">{item.hoverContent.footer}</p>
                                    </div>
                                 )}
                              </div>
                           </div>
                        )}
                     </div>
                  )
               })}
            </div>
         </div>
      </nav>
   )
}
