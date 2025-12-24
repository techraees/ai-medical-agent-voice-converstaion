'use client'

import { useState } from 'react'
import { Navbar } from '@/components/Navbar'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Check } from 'lucide-react'

export default function PricingPage() {
   const [isAnnual, setIsAnnual] = useState(true)

   const plans = [
      {
         name: 'Free',
         price: '$0',
         period: 'Always free',
         features: ['1 Free Medical Consultation', 'Free Medical Report'],
         isActive: true,
      },
      {
         name: 'Pro',
         price: '$6.99',
         period: '/month',
         annualPrice: '$83.88',
         features: ['20 Medical Consultant / Month', 'Unlimited Medical Reports', 'Email Support', 'Priority Support'],
         isActive: false,
      },
   ]

   return (
      <div className="min-h-screen bg-background">
         <Navbar />
         <div className="container mx-auto px-4 py-8">
            <div className="text-center mb-12">
               <h1 className="text-4xl font-bold mb-4">Join Subscription</h1>
            </div>

            <div className="flex justify-center gap-6 max-w-4xl mx-auto">
               {plans.map((plan) => (
                  <Card key={plan.name} className={`w-full max-w-sm ${plan.isActive ? 'ring-2 ring-primary' : ''}`}>
                     <CardHeader>
                        <div className="flex items-center justify-between">
                           <div>
                              <CardTitle className="text-2xl">{plan.name}</CardTitle>
                              <div className="mt-2">
                                 <span className="text-3xl font-bold">{plan.price}</span>
                                 {plan.period && <span className="text-muted-foreground ml-1">{plan.period}</span>}
                              </div>
                           </div>
                           {plan.isActive && <Badge variant="secondary">Active</Badge>}
                        </div>
                        {plan.name === 'Pro' && (
                           <div className="mt-4 flex items-center gap-2">
                              <input
                                 type="checkbox"
                                 id="annual"
                                 checked={isAnnual}
                                 onChange={(e) => setIsAnnual(e.target.checked)}
                                 className="h-4 w-4"
                              />
                              <label htmlFor="annual" className="text-sm">
                                 Billed annually
                              </label>
                           </div>
                        )}
                     </CardHeader>
                     <CardContent>
                        <ul className="space-y-3">
                           {plan.features.map((feature, index) => (
                              <li key={index} className="flex items-start gap-2">
                                 <Check className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                                 <span className="text-sm">{feature}</span>
                              </li>
                           ))}
                        </ul>
                     </CardContent>
                     <CardFooter>
                        {plan.name === 'Pro' ? (
                           <Button className="w-full">Subscribe</Button>
                        ) : (
                           <Button className="w-full" variant="outline" disabled>
                              Current Plan
                           </Button>
                        )}
                     </CardFooter>
                  </Card>
               ))}
            </div>
         </div>
      </div>
   )
}
