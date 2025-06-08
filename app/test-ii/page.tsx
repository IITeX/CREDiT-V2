"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/contexts/auth-context"
import { Shield, CheckCircle, XCircle, AlertCircle, Loader2 } from "lucide-react"

export default function TestInternetIdentityPage() {
  const { login, logout, isAuthenticated, principal, authLoading } = useAuth()
  const [testResults, setTestResults] = useState<any>({})
  const [testing, setTesting] = useState(false)

  const runConnectivityTests = async () => {
    setTesting(true)
    const results: any = {}

    // Test 1: Check current environment
    results.environment = {
      origin: typeof window !== 'undefined' ? window.location.origin : 'unknown',
      network: process.env.NEXT_PUBLIC_DFX_NETWORK,
      icHost: process.env.NEXT_PUBLIC_IC_HOST,
      iiCanister: process.env.NEXT_PUBLIC_INTERNET_IDENTITY_CANISTER_ID
    }

    // Test 2: Check Internet Identity accessibility
    try {
      const response = await fetch('https://identity.ic0.app', { method: 'HEAD' })
      results.internetIdentity = {
        accessible: response.ok,
        status: response.status
      }
    } catch (error) {
      results.internetIdentity = {
        accessible: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }

    // Test 3: Check IC Network accessibility
    try {
      const response = await fetch('https://ic0.app/api/v2/status', { method: 'HEAD' })
      results.icNetwork = {
        accessible: response.ok,
        status: response.status
      }
    } catch (error) {
      results.icNetwork = {
        accessible: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }

    // Test 4: Check canister accessibility
    const canisters = [
      { name: 'Credentials', id: 'k7fau-4yaaa-aaaao-qkb2a-cai' },
      { name: 'Storage', id: 'kyega-raaaa-aaaao-qkb2q-cai' }
    ]

    results.canisters = {}
    for (const canister of canisters) {
      try {
        const response = await fetch(`https://ic0.app/api/v2/canister/${canister.id}/query`, { method: 'HEAD' })
        results.canisters[canister.name] = {
          accessible: response.ok,
          status: response.status
        }
      } catch (error) {
        results.canisters[canister.name] = {
          accessible: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        }
      }
    }

    setTestResults(results)
    setTesting(false)
  }

  const handleLogin = async () => {
    try {
      await login()
    } catch (error) {
      console.error("Login failed:", error)
    }
  }

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.error("Logout failed:", error)
    }
  }

  const getStatusIcon = (success: boolean) => {
    return success ? (
      <CheckCircle className="h-4 w-4 text-green-600" />
    ) : (
      <XCircle className="h-4 w-4 text-red-600" />
    )
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Internet Identity Test Page</h1>
        <p className="text-gray-600">Debug Internet Identity connection issues</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Authentication Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="h-5 w-5" />
              <span>Authentication Status</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span>Status:</span>
              <Badge variant={isAuthenticated ? "default" : "secondary"}>
                {authLoading ? "Loading..." : isAuthenticated ? "Authenticated" : "Not Authenticated"}
              </Badge>
            </div>
            
            {principal && (
              <div className="space-y-2">
                <span className="text-sm font-medium">Principal:</span>
                <p className="text-xs font-mono bg-gray-100 p-2 rounded break-all">
                  {principal.toString()}
                </p>
              </div>
            )}

            <div className="space-y-2">
              {!isAuthenticated ? (
                <Button onClick={handleLogin} disabled={authLoading} className="w-full">
                  {authLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Connecting...
                    </>
                  ) : (
                    <>
                      <Shield className="mr-2 h-4 w-4" />
                      Test Login with Internet Identity
                    </>
                  )}
                </Button>
              ) : (
                <Button onClick={handleLogout} variant="outline" className="w-full">
                  Logout
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Connectivity Tests */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <AlertCircle className="h-5 w-5" />
              <span>Connectivity Tests</span>
            </CardTitle>
            <CardDescription>
              Test network connectivity to IC services
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button onClick={runConnectivityTests} disabled={testing} className="w-full">
              {testing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Testing...
                </>
              ) : (
                "Run Connectivity Tests"
              )}
            </Button>

            {testResults.environment && (
              <div className="space-y-2">
                <h4 className="font-medium">Environment:</h4>
                <div className="text-xs space-y-1">
                  <div>Origin: {testResults.environment.origin}</div>
                  <div>Network: {testResults.environment.network}</div>
                  <div>IC Host: {testResults.environment.icHost}</div>
                </div>
              </div>
            )}

            {testResults.internetIdentity && (
              <div className="flex items-center justify-between">
                <span>Internet Identity:</span>
                <div className="flex items-center space-x-2">
                  {getStatusIcon(testResults.internetIdentity.accessible)}
                  <span className="text-sm">
                    {testResults.internetIdentity.accessible ? "Accessible" : "Failed"}
                  </span>
                </div>
              </div>
            )}

            {testResults.icNetwork && (
              <div className="flex items-center justify-between">
                <span>IC Network:</span>
                <div className="flex items-center space-x-2">
                  {getStatusIcon(testResults.icNetwork.accessible)}
                  <span className="text-sm">
                    {testResults.icNetwork.accessible ? "Accessible" : "Failed"}
                  </span>
                </div>
              </div>
            )}

            {testResults.canisters && (
              <div className="space-y-2">
                <h4 className="font-medium">Canisters:</h4>
                {Object.entries(testResults.canisters).map(([name, result]: [string, any]) => (
                  <div key={name} className="flex items-center justify-between">
                    <span>{name}:</span>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(result.accessible)}
                      <span className="text-sm">
                        {result.accessible ? "Accessible" : "Failed"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Debug Information */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Debug Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 text-sm">
            <div>
              <strong>Common Issues:</strong>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>CORS configuration issues</li>
                <li>Derivation origin mismatch</li>
                <li>Browser security settings blocking popups</li>
                <li>Network connectivity issues</li>
                <li>Incorrect canister IDs</li>
              </ul>
            </div>
            
            <div>
              <strong>Troubleshooting Steps:</strong>
              <ol className="list-decimal list-inside mt-2 space-y-1">
                <li>Check browser console for detailed error messages</li>
                <li>Ensure popups are allowed for this domain</li>
                <li>Try in incognito/private browsing mode</li>
                <li>Clear browser cache and cookies</li>
                <li>Verify network connectivity</li>
              </ol>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
