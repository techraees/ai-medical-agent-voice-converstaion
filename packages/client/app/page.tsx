'use client'

import { useState } from 'react'
import { Navbar } from '@/components/Navbar'
import { ChatArea } from '@/components/ChatArea'
import { DoctorCard } from '@/components/DoctorCard'
import { Button } from '@/components/ui/button'
import { useGetDoctorsQuery } from '@/lib/api/apiSlice'
import { Doctor } from '@/lib/api/apiSlice'
import { Plus } from 'lucide-react'

export default function Home() {
   const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null)
   const { data: doctors = [], isLoading } = useGetDoctorsQuery()

   return (
      <div className="min-h-screen bg-background">
         <Navbar />
         <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
               <h1 className="text-3xl font-bold mb-2">My Dashboard</h1>
               <div className="flex items-center justify-between">
                  <div className="flex gap-4">
                     <Button variant="outline">AI Medical Specialist</Button>
                     <Button variant="outline">General Physician</Button>
                  </div>
                  <Button>
                     <Plus className="h-4 w-4 mr-2" />
                     Start a Consultation
                  </Button>
               </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
               <div className="lg:col-span-2">
                  <div className="mb-6">
                     <h2 className="text-2xl font-semibold mb-4">AI Specialist Doctors Agent</h2>
                     {isLoading ? (
                        <div className="text-center py-8 text-muted-foreground">Loading doctors...</div>
                     ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                           {doctors.map((doctor: Doctor) => (
                              <DoctorCard
                                 key={doctor.id}
                                 doctor={doctor}
                                 onSelect={setSelectedDoctor}
                                 isSelected={selectedDoctor?.id === doctor.id}
                              />
                           ))}
                        </div>
                     )}
                  </div>
               </div>

               <div className="lg:col-span-1">
                  <div className="sticky top-4">
                     <ChatArea
                        doctorId={selectedDoctor?.id || null}
                        doctorName={selectedDoctor?.name}
                        doctorImage={selectedDoctor?.image}
                     />
                  </div>
               </div>
            </div>
         </div>
      </div>
   )
}
