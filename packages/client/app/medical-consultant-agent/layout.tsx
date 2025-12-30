import React from 'react'

export default function MedicalConsultantAgentLayout({
   children,
}: Readonly<{
   children: React.ReactNode
}>) {
   return <div className="min-h-screen bg-white">{children}</div>
}
