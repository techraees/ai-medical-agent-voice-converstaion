'use client'

import { Navbar } from '@/components/Navbar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useGetConsultationsQuery } from '@/lib/api/apiSlice'
import { Eye } from 'lucide-react'

export default function HistoryPage() {
   const { data: consultations = [], isLoading } = useGetConsultationsQuery()

   return (
      <div className="min-h-screen bg-background">
         <Navbar />
         <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">Consultation History</h1>

            {isLoading ? (
               <div className="text-center py-8 text-muted-foreground">Loading history...</div>
            ) : consultations.length === 0 ? (
               <Card>
                  <CardContent className="py-12 text-center">
                     <p className="text-muted-foreground">No consultation history found</p>
                  </CardContent>
               </Card>
            ) : (
               <div className="space-y-4">
                  <Card>
                     <CardHeader>
                        <div className="flex items-center justify-between">
                           <div className="flex gap-4">
                              <CardTitle className="text-sm font-medium">AI Medical Specialist</CardTitle>
                              <CardTitle className="text-sm font-medium">Description</CardTitle>
                              <CardTitle className="text-sm font-medium">Date</CardTitle>
                           </div>
                           <CardTitle className="text-sm font-medium">Action</CardTitle>
                        </div>
                     </CardHeader>
                     <CardContent>
                        <div className="space-y-4">
                           {consultations.map((consultation) => (
                              <div
                                 key={consultation.id}
                                 className="flex items-center justify-between py-4 border-b last:border-0"
                              >
                                 <div className="flex items-center gap-8 flex-1">
                                    <div className="w-48">
                                       <p className="font-medium">{consultation.doctorName}</p>
                                    </div>
                                    <div className="flex-1">
                                       <p className="text-sm text-muted-foreground">{consultation.description}</p>
                                    </div>
                                    <div className="w-32">
                                       <p className="text-sm text-muted-foreground">
                                          {new Date(consultation.date).toLocaleDateString()}
                                       </p>
                                    </div>
                                 </div>
                                 <div className="flex items-center gap-2">
                                    <Badge variant={consultation.status === 'completed' ? 'default' : 'secondary'}>
                                       {consultation.status}
                                    </Badge>
                                    <Button variant="outline" size="sm">
                                       <Eye className="h-4 w-4 mr-2" />
                                       View Report
                                    </Button>
                                 </div>
                              </div>
                           ))}
                        </div>
                     </CardContent>
                  </Card>
               </div>
            )}
         </div>
      </div>
   )
}
