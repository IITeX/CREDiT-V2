"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/contexts/auth-context"

export default function TestAuthPage() {
  const { login, logout, isAuthenticated, principal, loading, error } = useAuth()
  const [testResult, setTestResult] = useState<string>("")

  const handleDevLogin = () => {
    console.log("🔧 Setting dev principal...")
    localStorage.setItem('dev_principal', 'kuu6r-abgw-yol3-7rdi-vsde-xpcp-jf3f-fwoy-mdtq-zumu-pvqt-swfk-ak')
    console.log("🔧 Dev principal set, reloading...")
    window.location.reload()
  }

  const handleTestLocalStorage = () => {
    const devPrincipal = localStorage.getItem('dev_principal')
    const enableDevLogin = process.env.NEXT_PUBLIC_ENABLE_DEV_LOGIN
    setTestResult(`Dev Principal: ${devPrincipal}, Enable Dev Login: ${enableDevLogin}`)
  }

  const handleInternetIdentityLogin = async () => {
    setTestResult("Starting Internet Identity login...")
    try {
      const success = await login()
      setTestResult(success ? "Login successful!" : "Login failed")
    } catch (err) {
      setTestResult(`Login error: ${err}`)
    }
  }

  const handleLogout = async () => {
    await logout()
    localStorage.removeItem('dev_principal')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-8">
      <div className="max-w-2xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Authentication Test Page</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <strong>Authenticated:</strong> {isAuthenticated ? "Yes" : "No"}
              </div>
              <div>
                <strong>Loading:</strong> {loading ? "Yes" : "No"}
              </div>
              <div className="col-span-2">
                <strong>Principal:</strong> {principal ? principal.toString() : "None"}
              </div>
              <div className="col-span-2">
                <strong>Error:</strong> {error ? error.message : "None"}
              </div>
            </div>

            <div className="space-y-2">
              <Button onClick={handleDevLogin} variant="outline" className="w-full">
                🔧 Enable Dev Login
              </Button>

              <Button onClick={handleTestLocalStorage} variant="outline" className="w-full">
                🔍 Test LocalStorage
              </Button>

              <Button
                onClick={handleInternetIdentityLogin}
                disabled={loading}
                className="w-full"
              >
                {loading ? "Connecting..." : "Test Internet Identity Login"}
              </Button>

              <Button onClick={handleLogout} variant="destructive" className="w-full">
                Logout
              </Button>
            </div>

            {testResult && (
              <div className="p-3 bg-gray-100 rounded text-sm">
                <strong>Test Result:</strong> {testResult}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Debug Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs space-y-1 font-mono">
              <div>Environment: {process.env.NODE_ENV}</div>
              <div>DFX Network: {process.env.NEXT_PUBLIC_DFX_NETWORK}</div>
              <div>IC Host: {process.env.NEXT_PUBLIC_IC_HOST}</div>
              <div>II Canister: {process.env.NEXT_PUBLIC_INTERNET_IDENTITY_CANISTER_ID}</div>
              <div>Use Local II: {process.env.NEXT_PUBLIC_USE_LOCAL_II}</div>
              <div>Dev Login Enabled: {process.env.NEXT_PUBLIC_ENABLE_DEV_LOGIN}</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
