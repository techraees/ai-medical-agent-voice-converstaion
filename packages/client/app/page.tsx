'use client'

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
      <>
         <h1>Hello World</h1>
         {loading && <p>Loading...</p>}
         {error && <p>Error: {error}</p>}
         {data && <pre>{JSON.stringify(data, null, 2)}</pre>}
      </>
   )
}
