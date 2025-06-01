"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"

export default function SimpleTestPage() {
  const [devPrincipal, setDevPrincipal] = useState<string | null>(null)
  const [envVars, setEnvVars] = useState<any>({})

  useEffect(() => {
    // Check localStorage
    const stored = localStorage.getItem('dev_principal')
    setDevPrincipal(stored)

    // Check environment variables
    setEnvVars({
      NODE_ENV: process.env.NODE_ENV,
      NEXT_PUBLIC_ENABLE_DEV_LOGIN: process.env.NEXT_PUBLIC_ENABLE_DEV_LOGIN,
      NEXT_PUBLIC_DFX_NETWORK: process.env.NEXT_PUBLIC_DFX_NETWORK,
      NEXT_PUBLIC_IC_HOST: process.env.NEXT_PUBLIC_IC_HOST,
    })
  }, [])

  const handleSetDevPrincipal = () => {
    const principal = 'kuu6r-abgw-yol3-7rdi-vsde-xpcp-jf3f-fwoy-mdtq-zumu-pvqt-swfk-ak'
    localStorage.setItem('dev_principal', principal)
    setDevPrincipal(principal)
    console.log("✅ Dev principal set:", principal)
  }

  const handleClearDevPrincipal = () => {
    localStorage.removeItem('dev_principal')
    setDevPrincipal(null)
    console.log("✅ Dev principal cleared")
  }

  const handleRefresh = () => {
    window.location.reload()
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold">Simple Authentication Test</h1>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">LocalStorage Test</h2>
          <div className="space-y-2">
            <p><strong>Dev Principal:</strong> {devPrincipal || "None"}</p>
            <div className="space-x-2">
              <Button onClick={handleSetDevPrincipal}>Set Dev Principal</Button>
              <Button onClick={handleClearDevPrincipal} variant="outline">Clear Dev Principal</Button>
              <Button onClick={handleRefresh} variant="secondary">Refresh Page</Button>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Environment Variables</h2>
          <div className="space-y-1 text-sm font-mono">
            {Object.entries(envVars).map(([key, value]) => (
              <div key={key}>
                <strong>{key}:</strong> {String(value)}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Manual Auth Test</h2>
          <Button 
            onClick={() => {
              // Manually test the auth functions
              import('@/lib/auth').then(auth => {
                console.log("Auth module:", auth)
                console.log("getDevPrincipal():", auth.getDevPrincipal())
              })
            }}
          >
            Test Auth Module
          </Button>
        </div>
      </div>
    </div>
  )
}
