'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Plus, Search } from 'lucide-react'
import {
   Dialog,
   DialogContent,
   DialogDescription,
   DialogHeader,
   DialogTitle,
   DialogClose,
} from '@/components/ui/dialog'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { AIDoctorAgents } from '@/data/medical-consultant-agent/doctorList'

const page = () => {
   const [isModalOpen, setIsModalOpen] = useState(false)
   const [searchQuery, setSearchQuery] = useState('')

   const handleStartConsultation = () => {
      setIsModalOpen(true)
   }

   const filteredDoctors = AIDoctorAgents.filter(
      (doctor) =>
         doctor.specialist.toLowerCase().includes(searchQuery.toLowerCase()) ||
         doctor.description.toLowerCase().includes(searchQuery.toLowerCase())
   )

   const handleDoctorSelect = (doctor: (typeof AIDoctorAgents)[0]) => {
      console.log('Selected doctor:', doctor)
      // Handle doctor selection - navigate to consultation page or start chat
      setIsModalOpen(false)
   }

   return (
      <div className="min-h-screen bg-background p-6 md:p-8">
         {/* Header Section */}
         <div className="mb-8 flex items-center justify-between">
            <h1 className="text-3xl md:text-4xl font-bold">Medical Consultant</h1>
            <Button onClick={handleStartConsultation} size="lg" className="gap-2">
               <Plus className="h-5 w-5" />
               Start a Consultation
            </Button>
         </div>

         {/* Consultation Modal */}
         <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogContent className="max-w-4xl">
               <DialogClose onClose={() => setIsModalOpen(false)} />
               <DialogHeader>
                  <DialogTitle>Start a Consultation</DialogTitle>
                  <DialogDescription>
                     Search for a doctor or select from the list below to start your consultation.
                  </DialogDescription>
               </DialogHeader>

               <div className="p-6 space-y-6">
                  {/* Search Input */}
                  <div className="relative">
                     <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                     <Input
                        type="text"
                        placeholder="Search doctors by specialty or description..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                     />
                  </div>

                  {/* Doctors List */}
                  <div className="space-y-4">
                     <h3 className="text-lg font-semibold">Available Doctors ({filteredDoctors.length})</h3>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto pr-2">
                        {filteredDoctors.length > 0 ? (
                           filteredDoctors.map((doctor) => (
                              <Card
                                 key={doctor.id}
                                 className="cursor-pointer hover:shadow-lg transition-all"
                                 onClick={() => handleDoctorSelect(doctor)}
                              >
                                 <CardHeader>
                                    <div className="flex items-center gap-4">
                                       <Avatar className="h-16 w-16">
                                          <AvatarImage src={doctor.image} alt={doctor.specialist} />
                                          <AvatarFallback>{doctor.specialist[0]}</AvatarFallback>
                                       </Avatar>
                                       <div className="flex-1">
                                          <CardTitle className="text-lg">{doctor.specialist}</CardTitle>
                                          <CardDescription className="line-clamp-2">
                                             {doctor.description}
                                          </CardDescription>
                                       </div>
                                    </div>
                                 </CardHeader>
                                 <CardContent>
                                    <Button className="w-full" variant="outline">
                                       Select Doctor
                                    </Button>
                                 </CardContent>
                              </Card>
                           ))
                        ) : (
                           <div className="col-span-2 text-center py-8 text-muted-foreground">
                              No doctors found matching your search.
                           </div>
                        )}
                     </div>
                  </div>
               </div>
            </DialogContent>
         </Dialog>

         {/* Main Content Area */}
         <div className="border-2 border-dashed border-muted-foreground/30 rounded-lg p-8 md:p-12">
            <div className="flex flex-col items-center justify-center space-y-6 max-w-2xl mx-auto">
               {/* Illustration Area */}
               <div className="w-full max-w-md">
                  <div className="relative">
                     {/* Person Illustration */}
                     <div className="flex items-center justify-center">
                        <div className="relative">
                           {/* Person */}
                           <div className="flex items-end justify-center">
                              <div className="w-32 h-40 md:w-40 md:h-48 flex flex-col items-center">
                                 {/* Head */}
                                 <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-muted mb-2 border-2 border-border"></div>
                                 {/* Body - Purple Top */}
                                 <div className="w-24 h-20 md:w-32 md:h-24 rounded-t-full bg-purple-500/40"></div>
                                 {/* Pants - Dark */}
                                 <div className="w-24 h-8 md:w-32 md:h-12 bg-foreground/80 rounded-b-full"></div>
                              </div>

                              {/* Tablet/Screen */}
                              <div className="ml-4 relative">
                                 <div className="w-32 h-40 md:w-40 md:h-52 bg-muted rounded-lg shadow-lg transform -rotate-6 border-2 border-border">
                                    {/* Screen Content */}
                                    <div className="p-3 h-full flex flex-col bg-background rounded">
                                       {/* Profile Picture with Blue Background */}
                                       <div className="flex items-center gap-2 mb-2">
                                          <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center">
                                             <div className="w-8 h-8 rounded-full bg-blue-300"></div>
                                          </div>
                                          <div className="flex-1 h-2 bg-muted rounded"></div>
                                       </div>
                                       {/* Video Call Interface Area */}
                                       <div className="flex-1 bg-muted/50 rounded mb-2"></div>
                                       {/* Green Button/Text */}
                                       <div className="h-6 bg-green-500 rounded"></div>
                                    </div>
                                 </div>
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>

               {/* Text Content */}
               <div className="text-center space-y-3">
                  <h2 className="text-2xl md:text-3xl font-bold">No Recent Consultations</h2>
                  <p className="text-muted-foreground text-base md:text-lg">
                     It looks like you haven't consulted with any doctors yet.
                  </p>
               </div>

               {/* Bottom Button */}
               <div className="pt-4">
                  <Button onClick={handleStartConsultation} size="lg" className="gap-2">
                     <Plus className="h-5 w-5" />
                     Start a Consultation
                  </Button>
               </div>
            </div>
         </div>

         {/* All Doctors Section */}
         <div className="mt-16 space-y-6">
            <div className="text-center space-y-2">
               <h2 className="text-3xl md:text-4xl font-bold">All Available Doctors</h2>
               <p className="text-muted-foreground">Browse through our team of specialized AI medical consultants</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
               {AIDoctorAgents.map((doctor) => (
                  <Card
                     key={doctor.id}
                     className="cursor-pointer hover:shadow-lg transition-all overflow-hidden"
                     onClick={() => handleDoctorSelect(doctor)}
                  >
                     <div className="relative h-48 w-full bg-muted">
                        <img src={doctor.image} alt={doctor.specialist} className="w-full h-full object-cover" />
                     </div>
                     <CardHeader>
                        <CardTitle className="text-xl">{doctor.specialist}</CardTitle>
                        <CardDescription className="line-clamp-2">{doctor.description}</CardDescription>
                     </CardHeader>
                     <CardContent>
                        <Button
                           className="w-full"
                           variant="outline"
                           onClick={(e) => {
                              e.stopPropagation()
                              handleDoctorSelect(doctor)
                           }}
                        >
                           Select Doctor
                        </Button>
                     </CardContent>
                  </Card>
               ))}
            </div>
         </div>
      </div>
   )
}

export default page
