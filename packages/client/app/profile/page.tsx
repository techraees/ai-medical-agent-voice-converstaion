'use client'

import { Navbar } from '@/components/Navbar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function ProfilePage() {
   return (
      <div className="min-h-screen bg-background">
         <Navbar />
         <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">Profile</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               <Card className="md:col-span-1">
                  <CardHeader className="text-center">
                     <div className="flex justify-center mb-4">
                        <Avatar className="h-24 w-24">
                           <AvatarImage src="/avatar.png" alt="User" />
                           <AvatarFallback>U</AvatarFallback>
                        </Avatar>
                     </div>
                     <CardTitle>John Doe</CardTitle>
                     <CardDescription>john.doe@example.com</CardDescription>
                  </CardHeader>
                  <CardContent>
                     <Button className="w-full" variant="outline">
                        Change Avatar
                     </Button>
                  </CardContent>
               </Card>

               <Card className="md:col-span-2">
                  <CardHeader>
                     <CardTitle>Personal Information</CardTitle>
                     <CardDescription>Update your personal information</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                     <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                           <Label htmlFor="firstName">First Name</Label>
                           <Input id="firstName" defaultValue="John" />
                        </div>
                        <div className="space-y-2">
                           <Label htmlFor="lastName">Last Name</Label>
                           <Input id="lastName" defaultValue="Doe" />
                        </div>
                     </div>
                     <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" defaultValue="john.doe@example.com" />
                     </div>
                     <div className="space-y-2">
                        <Label htmlFor="phone">Phone</Label>
                        <Input id="phone" type="tel" defaultValue="+1 234 567 8900" />
                     </div>
                     <Button>Save Changes</Button>
                  </CardContent>
               </Card>
            </div>
         </div>
      </div>
   )
}
