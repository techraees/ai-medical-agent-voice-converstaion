'use client'

import * as React from 'react'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface DialogProps {
   open: boolean
   onOpenChange: (open: boolean) => void
   children: React.ReactNode
}

interface DialogContentProps extends React.HTMLAttributes<HTMLDivElement> {
   children: React.ReactNode
}

const Dialog = ({ open, onOpenChange, children }: DialogProps) => {
   React.useEffect(() => {
      if (open) {
         document.body.style.overflow = 'hidden'
      } else {
         document.body.style.overflow = 'unset'
      }
      return () => {
         document.body.style.overflow = 'unset'
      }
   }, [open])

   if (!open) return null

   return (
      <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={() => onOpenChange(false)}>
         <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
         <div onClick={(e) => e.stopPropagation()}>{children}</div>
      </div>
   )
}

const DialogContent = React.forwardRef<HTMLDivElement, DialogContentProps>(({ className, children, ...props }, ref) => {
   return (
      <div
         ref={ref}
         className={cn(
            'relative z-50 w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-background rounded-lg border shadow-lg animate-in fade-in-0 zoom-in-95 slide-in-from-bottom-2',
            className
         )}
         {...props}
      >
         {children}
      </div>
   )
})
DialogContent.displayName = 'DialogContent'

const DialogHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
   <div className={cn('flex flex-col space-y-1.5 p-6 pb-4', className)} {...props} />
)
DialogHeader.displayName = 'DialogHeader'

const DialogTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
   ({ className, ...props }, ref) => (
      <h2 ref={ref} className={cn('text-2xl font-semibold leading-none tracking-tight', className)} {...props} />
   )
)
DialogTitle.displayName = 'DialogTitle'

const DialogDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
   ({ className, ...props }, ref) => (
      <p ref={ref} className={cn('text-sm text-muted-foreground', className)} {...props} />
   )
)
DialogDescription.displayName = 'DialogDescription'

const DialogClose = ({ onClose }: { onClose: () => void }) => (
   <button
      onClick={onClose}
      className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none"
   >
      <X className="h-4 w-4" />
      <span className="sr-only">Close</span>
   </button>
)

export { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose }
