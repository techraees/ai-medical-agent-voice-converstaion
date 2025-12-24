'use client'

import { Button } from '@/components/ui/button'
import { useEffect, useState } from 'react'

export default function Home() {
   const [data, setData] = useState(null)
   const [loading, setLoading] = useState(true)
   const [error, setError] = useState(null)

   useEffect(() => {
      fetch('/api/users')
         .then((response) => {
            if (!response.ok) {
               throw new Error('Network response was not ok')
            }
            return response.json()
         })
         .then((data) => {
            setData(data)
            setLoading(false)
         })
         .catch((error) => {
            setError(error.message)
            setLoading(false)
         })
   }, [])

   return (
      <div className="p-8 space-y-4">
         <h1 className="text-3xl font-bold underline">Hello world!</h1>

         <div className="space-x-4">
            <Button>Default Button</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="destructive">Destructive</Button>
         </div>

         {loading && <p>Loading...</p>}
         {error && <p className="text-red-500">Error: {error}</p>}
         {data && <pre className="bg-gray-100 p-4 rounded">{JSON.stringify(data, null, 2)}</pre>}
      </div>
   )
}
