'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'

interface AuthModalProps {
   isOpen: boolean
   onClose: () => void
   onLoginSuccess: (token: string, user: any) => void
}

export const AuthModal = ({ isOpen, onClose, onLoginSuccess }: AuthModalProps) => {
   const [isLoading, setIsLoading] = useState(false)
   const [error, setError] = useState('')
   const [activeTab, setActiveTab] = useState<'login' | 'register'>('login')

   // Login State
   const [loginEmail, setLoginEmail] = useState('')
   const [loginPassword, setLoginPassword] = useState('')

   // Register State
   const [registerName, setRegisterName] = useState('')
   const [registerEmail, setRegisterEmail] = useState('')
   const [registerPassword, setRegisterPassword] = useState('')
   const [registerPhone, setRegisterPhone] = useState('')

   const handleLogin = async (e: React.FormEvent) => {
      e.preventDefault()
      setIsLoading(true)
      setError('')

      try {
         const response = await fetch('/api/medical-consultant-agent/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: loginEmail, password: loginPassword }),
         })

         const data = await response.json()

         if (!response.ok) {
            throw new Error(data.message || 'Login failed')
         }

         onLoginSuccess(data.data.accessToken, data.data.user)
         onClose()
      } catch (err: any) {
         setError(err.message)
      } finally {
         setIsLoading(false)
      }
   }

   const handleRegister = async (e: React.FormEvent) => {
      e.preventDefault()
      setIsLoading(true)
      setError('')

      try {
         const response = await fetch('/api/medical-consultant-agent/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
               name: registerName,
               email: registerEmail,
               password: registerPassword,
               phone: registerPhone,
               role: 'patient', // Default role
            }),
         })

         const data = await response.json()

         if (!response.ok) {
            throw new Error(data.message || 'Registration failed')
         }

         // Auto login after register
         const loginResponse = await fetch('/api/medical-consultant-agent/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: registerEmail, password: registerPassword }),
         })

         if (loginResponse.ok) {
            const loginData = await loginResponse.json()
            onLoginSuccess(loginData.data.accessToken, loginData.data.user)
            onClose()
         } else {
            setError('Registration successful, please log in.')
            setActiveTab('login')
         }
      } catch (err: any) {
         setError(err.message)
      } finally {
         setIsLoading(false)
      }
   }

   return (
      <Dialog open={isOpen} onOpenChange={onClose}>
         <DialogContent className="sm:max-w-[425px] p-8">
            <DialogHeader>
               <DialogTitle>Account Access</DialogTitle>
               <DialogDescription>Login or create an account to start your consultation.</DialogDescription>
            </DialogHeader>

            {error && (
               <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                  <span className="block sm:inline">{error}</span>
               </div>
            )}

            <div className="w-full">
               <div className="grid w-full grid-cols-2 mb-4 bg-muted/50 p-1 rounded-lg">
                  <button
                     type="button"
                     className={`text-sm font-medium py-2 rounded-md transition-all ${
                        activeTab === 'login'
                           ? 'bg-background shadow-sm text-foreground'
                           : 'text-muted-foreground hover:text-foreground'
                     }`}
                     onClick={() => setActiveTab('login')}
                  >
                     Login
                  </button>
                  <button
                     type="button"
                     className={`text-sm font-medium py-2 rounded-md transition-all ${
                        activeTab === 'register'
                           ? 'bg-background shadow-sm text-foreground'
                           : 'text-muted-foreground hover:text-foreground'
                     }`}
                     onClick={() => setActiveTab('register')}
                  >
                     Register
                  </button>
               </div>

               {activeTab === 'login' ? (
                  <form onSubmit={handleLogin} className="space-y-4">
                     <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                           id="email"
                           type="email"
                           placeholder="m@example.com"
                           value={loginEmail}
                           onChange={(e) => setLoginEmail(e.target.value)}
                           required
                        />
                     </div>
                     <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <Input
                           id="password"
                           type="password"
                           value={loginPassword}
                           onChange={(e) => setLoginPassword(e.target.value)}
                           required
                        />
                     </div>
                     <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? 'Logging in...' : 'Login'}
                     </Button>
                  </form>
               ) : (
                  <form onSubmit={handleRegister} className="space-y-4">
                     <div className="space-y-2">
                        <Label htmlFor="register-name">Full Name</Label>
                        <Input
                           id="register-name"
                           value={registerName}
                           onChange={(e) => setRegisterName(e.target.value)}
                           required
                        />
                     </div>
                     <div className="space-y-2">
                        <Label htmlFor="register-email">Email</Label>
                        <Input
                           id="register-email"
                           type="email"
                           value={registerEmail}
                           onChange={(e) => setRegisterEmail(e.target.value)}
                           required
                        />
                     </div>
                     <div className="space-y-2">
                        <Label htmlFor="register-phone">Phone (Optional)</Label>
                        <Input
                           id="register-phone"
                           type="tel"
                           value={registerPhone}
                           onChange={(e) => setRegisterPhone(e.target.value)}
                        />
                     </div>
                     <div className="space-y-2">
                        <Label htmlFor="register-password">Password</Label>
                        <Input
                           id="register-password"
                           type="password"
                           value={registerPassword}
                           onChange={(e) => setRegisterPassword(e.target.value)}
                           required
                        />
                     </div>
                     <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? 'Creating account...' : 'Create Account'}
                     </Button>
                  </form>
               )}
            </div>
         </DialogContent>
      </Dialog>
   )
}
