'use client'

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Doctor } from '@/lib/api/apiSlice'
import { Crown } from 'lucide-react'

interface DoctorCardProps {
   doctor: Doctor
   onSelect: (doctor: Doctor) => void
   isSelected?: boolean
}

export function DoctorCard({ doctor, onSelect, isSelected }: DoctorCardProps) {
   return (
      <Card
         className={`cursor-pointer transition-all hover:shadow-lg ${isSelected ? 'ring-2 ring-primary' : ''}`}
         onClick={() => onSelect(doctor)}
      >
         <CardHeader>
            <div className="flex items-start justify-between">
               <div className="flex items-center gap-3">
                  <Avatar className="h-16 w-16">
                     <AvatarImage src={doctor.image} alt={doctor.name} />
                     <AvatarFallback>{doctor.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                     <CardTitle className="text-lg">{doctor.name}</CardTitle>
                     <CardDescription>{doctor.specialty}</CardDescription>
                  </div>
               </div>
               {doctor.isPremium && (
                  <Badge variant="secondary" className="gap-1">
                     <Crown className="h-3 w-3" />
                     Premium
                  </Badge>
               )}
            </div>
         </CardHeader>
         <CardContent>
            <p className="text-sm text-muted-foreground line-clamp-2">{doctor.description}</p>
         </CardContent>
         <CardFooter>
            <Button
               className="w-full"
               variant={isSelected ? 'default' : 'outline'}
               onClick={(e) => {
                  e.stopPropagation()
                  onSelect(doctor)
               }}
            >
               {isSelected ? 'Selected' : 'Select Doctor'}
            </Button>
         </CardFooter>
      </Card>
   )
}
