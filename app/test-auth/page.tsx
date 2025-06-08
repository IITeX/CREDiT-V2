"use client"

import { useState } from "react"
import { useInternetIdentity } from "@/hooks/useInternetIdentity"
import { InternetIdentityButton } from "@/components/auth/internet-identity-button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, AlertCircle, User, Globe, Key, TestTube } from "lucide-react"

export default function TestAuthPage() {
  const {
    isAuthenticated,
    loading,
    error,
    principal,
    isDemoMode,
    isDemoAvailable,
    demoPrincipal,
    getShortPrincipal,
    getPrincipalText,
    refresh,
    logout
  } = useInternetIdentity()

  const [testResults, setTestResults] = useState<string[]>([])

  const runConnectivityTest = async () => {
    const results: string[] = []

    try {
      results.push("🔍 Testing Internet Identity connectivity...")

      // Test 1: Check if Internet Identity is accessible
      const response = await fetch('https://identity.ic0.app', {
        method: 'HEAD',
        mode: 'no-cors'
      })
      results.push("✅ Internet Identity service is accessible")

      // Test 2: Check popup permissions
      const testPopup = window.open('', '_blank', 'width=1,height=1')
      if (testPopup) {
        testPopup.close()
        results.push("✅ Popup permissions are allowed")
      } else {
        results.push("❌ Popup permissions are blocked")
      }

      // Test 3: Check environment variables
      if (process.env.NEXT_PUBLIC_DFX_NETWORK) {
        results.push(`✅ Network: ${process.env.NEXT_PUBLIC_DFX_NETWORK}`)
      } else {
        results.push("❌ Network environment not set")
      }

      if (process.env.NEXT_PUBLIC_CREDENTIAL_NFT_CANISTER_ID) {
        results.push(`✅ Credential NFT Canister: ${process.env.NEXT_PUBLIC_CREDENTIAL_NFT_CANISTER_ID}`)
      } else {
        results.push("❌ Credential NFT Canister ID not set")
      }

    } catch (err) {
      results.push(`❌ Connectivity test failed: ${err}`)
    }

    setTestResults(results)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2">Internet Identity Test</h1>
          <p className="text-muted-foreground">
            Test and debug Internet Identity authentication
          </p>
        </div>

        {/* Authentication Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User className="h-5 w-5" />
              <span>Authentication Status</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Status:</label>
                <div className="flex items-center space-x-2 mt-1">
                  {isAuthenticated ? (
                    <>
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        Authenticated
                      </Badge>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="h-4 w-4 text-red-500" />
                      <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                        Not Authenticated
                      </Badge>
                    </>
                  )}
                  {isDemoMode && (
                    <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                      Demo Mode
                    </Badge>
                  )}
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium">Loading:</label>
                <div className="mt-1">
                  <Badge variant={loading ? "default" : "outline"}>
                    {loading ? "Loading..." : "Ready"}
                  </Badge>
                </div>
              </div>
            </div>

            {principal && (
              <div>
                <label className="text-sm font-medium">Principal:</label>
                <div className="mt-1 space-y-2">
                  <div className="font-mono text-sm bg-gray-100 p-2 rounded">
                    {getPrincipalText()}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Short: {getShortPrincipal()}
                  </div>
                </div>
              </div>
            )}

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Authentication Controls */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Globe className="h-5 w-5" />
              <span>Authentication Controls</span>
            </CardTitle>
            <CardDescription>
              Test different authentication methods
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {!isAuthenticated ? (
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Internet Identity Login</h4>
                  <InternetIdentityButton 
                    className="w-full"
                    onSuccess={() => {
                      console.log("✅ Test page: Login successful!")
                    }}
                    onError={(error) => {
                      console.error("❌ Test page: Login failed:", error)
                    }}
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="font-medium">Successfully authenticated!</span>
                </div>
                
                <div className="flex space-x-2">
                  <Button onClick={refresh} variant="outline">
                    Refresh Auth
                  </Button>
                  <Button onClick={logout} variant="destructive">
                    Logout
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Connectivity Test */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TestTube className="h-5 w-5" />
              <span>Connectivity Test</span>
            </CardTitle>
            <CardDescription>
              Test Internet Identity connectivity and configuration
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button onClick={runConnectivityTest} variant="outline">
              Run Connectivity Test
            </Button>

            {testResults.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium">Test Results:</h4>
                <div className="bg-gray-100 p-3 rounded text-sm font-mono space-y-1">
                  {testResults.map((result, index) => (
                    <div key={index} className={
                      result.includes('✅') ? 'text-green-600' :
                      result.includes('❌') ? 'text-red-600' :
                      'text-gray-600'
                    }>
                      {result}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Demo Configuration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Key className="h-5 w-5" />
              <span>Demo Configuration</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Demo Available:</label>
                <div className="mt-1">
                  <Badge variant={isDemoAvailable ? "default" : "outline"}>
                    {isDemoAvailable ? "Yes" : "No"}
                  </Badge>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Demo Principal:</label>
                <div className="mt-1 font-mono text-xs bg-gray-100 p-2 rounded">
                  {demoPrincipal || "Not configured"}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Environment Info */}
        <Card>
          <CardHeader>
            <CardTitle>Environment Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <label className="font-medium">Network:</label>
                <div className="font-mono">{process.env.NEXT_PUBLIC_DFX_NETWORK || "Not set"}</div>
              </div>
              <div>
                <label className="font-medium">IC Host:</label>
                <div className="font-mono">{process.env.NEXT_PUBLIC_IC_HOST || "Not set"}</div>
              </div>
              <div>
                <label className="font-medium">Credential NFT Canister:</label>
                <div className="font-mono">{process.env.NEXT_PUBLIC_CREDENTIAL_NFT_CANISTER_ID || "Not set"}</div>
              </div>
              <div>
                <label className="font-medium">Storage Canister:</label>
                <div className="font-mono">{process.env.NEXT_PUBLIC_STORAGE_CANISTER_ID || "Not set"}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="text-center">
          <Button asChild variant="outline">
            <a href="/signup">Go to Signup</a>
          </Button>
        </div>
      </div>
    </div>
  )
}
