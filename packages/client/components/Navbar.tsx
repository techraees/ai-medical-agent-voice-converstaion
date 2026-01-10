'use client'

import { Button } from '@/components/ui/button'
import { Heart } from 'lucide-react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState, useEffect, useRef } from 'react'
import { useDispatch } from 'react-redux'
import { setNavbarHeight } from '@/lib/slices/navbarSlice'

interface NavItemHoverContent {
   title: string
   body: string
   footer?: string
   image?: string
   video?: string
}

export function Navbar() {
   const pathname = usePathname()
   const router = useRouter()
   const [hoveredItem, setHoveredItem] = useState<string | null>(null)
   const dispatch = useDispatch()
   const navbarRef = useRef<HTMLElement>(null)

   // Measure navbar height and update Redux on mount, resize, and content changes
   useEffect(() => {
      const updateNavbarHeight = () => {
         if (navbarRef.current) {
            const height = navbarRef.current.offsetHeight
            dispatch(setNavbarHeight(height))
         }
      }

      // Initial measurement
      updateNavbarHeight()

      // Use ResizeObserver to track height changes (including content changes)
      let resizeObserver: ResizeObserver | null = null
      if (navbarRef.current && typeof ResizeObserver !== 'undefined') {
         resizeObserver = new ResizeObserver(() => {
            updateNavbarHeight()
         })
         resizeObserver.observe(navbarRef.current)
      }

      // Update on window resize as fallback
      window.addEventListener('resize', updateNavbarHeight)

      // Cleanup
      return () => {
         window.removeEventListener('resize', updateNavbarHeight)
         if (resizeObserver && navbarRef.current) {
            resizeObserver.unobserve(navbarRef.current)
         }
      }
   }, [dispatch])

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
            image: 'https://images.unsplash.com/photo-1522199755839-a2bacb67c546?q=80&w=2072&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
         },
      },
      {
         href: '/medical-consultant-agent',
         label: 'MCA',
         hoverContent: {
            title: 'Medical Consultant Agent',
            body: 'AI-powered medical consultation platform with voice conversation capabilities. Get instant medical advice and support.',
            footer: 'Start consultation',
            image: 'https://plus.unsplash.com/premium_photo-1673953509982-632a317d1f8c?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
         },
      },
      {
         href: '/theme-park-chatbot',
         label: 'TPC',
         hoverContent: {
            title: 'Theme Park Chatbot',
            body: 'AI-powered chatbot for theme park information. Get ticket booking, pricing, hotel details, and park information instantly.',
            footer: 'Start chatting',
            image: 'https://images.unsplash.com/photo-1701772863070-62c506bbf11a?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
         },
      },
      {
         href: '/product-reviews-summarizer',
         label: 'PRS',
         hoverContent: {
            title: 'Product Reviews Summarizer',
            body: 'Analyze thousands of product reviews instantly. Get concise summaries, sentiment analysis, and key insights to make data-driven decisions.',
            footer: 'Analyze reviews',
            image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
         },
      },
      {
         href: '/cyber-security-rag-system',
         label: 'CSRS',
         hoverContent: {
            title: 'Cyber Security RAG System',
            body: "Expert consultation on Pakistan's Cyber Security Laws and Regulations. Navigate legal frameworks and ensure compliance with AI-powered insights.",
            footer: 'Start Consultation',
            image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
         },
      },
   ]

   return (
      <nav ref={navbarRef} className="border-b bg-background/95 backdrop-blur">
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
                                       <p
                                          className="text-xs text-muted-foreground cursor-pointer hover:text-foreground transition-colors"
                                          onClick={() => {
                                             router.push(item.href)
                                             setHoveredItem(null)
                                          }}
                                       >
                                          {item.hoverContent.footer}
                                       </p>
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
