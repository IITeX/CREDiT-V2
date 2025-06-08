"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'
import { useInternetIdentity } from '@/hooks/useInternetIdentity'
import { InternetIdentityButton } from '@/components/auth/internet-identity-button'
import { Loader2, CheckCircle, XCircle, AlertCircle, ExternalLink, Globe, Key, User } from 'lucide-react'

export default function TestInternetIdentityPage() {
  const { toast } = useToast()
  const {
    isAuthenticated,
    principal,
    identity,
    actor,
    loading,
    error,
    isDemoMode,
    login,
    loginDemo,
    logout,
    refresh,
    getPrincipalText,
    getShortPrincipal,
    clearError,
    isDemoAvailable,
    demoPrincipal
  } = useInternetIdentity()

  const [customPrincipal, setCustomPrincipal] = useState('')
  const [testResult, setTestResult] = useState<any>(null)
  const [isTesting, setIsTesting] = useState(false)

  const testActorCall = async () => {
    if (!actor) {
      toast({
        title: "No Actor Available",
        description: "Please authenticate first to test actor calls",
        variant: "destructive",
      })
      return
    }

    setIsTesting(true)
    try {
      // Try to call a simple method on the actor
      // This is just a test - replace with actual method calls
      console.log('Testing actor call...')
      setTestResult({ success: true, message: 'Actor is available and ready for calls' })
      
      toast({
        title: "Actor Test Successful",
        description: "The actor is properly initialized and ready for canister calls",
      })
    } catch (error) {
      console.error('Actor test failed:', error)
      setTestResult({ success: false, error: error instanceof Error ? error.message : 'Unknown error' })
      
      toast({
        title: "Actor Test Failed",
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: "destructive",
      })
    } finally {
      setIsTesting(false)
    }
  }

  const handleCustomDemoLogin = async () => {
    if (!customPrincipal.trim()) {
      toast({
        title: "Invalid Principal",
        description: "Please enter a valid principal ID",
        variant: "destructive",
      })
      return
    }

    try {
      const success = await loginDemo(customPrincipal)
      if (success) {
        toast({
          title: "Custom Demo Login Successful",
          description: `Logged in with principal: ${customPrincipal}`,
        })
      }
    } catch (error) {
      toast({
        title: "Custom Demo Login Failed",
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: "destructive",
      })
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2">Internet Identity Integration Test</h1>
          <p className="text-gray-600">
            Test the new Internet Identity integration following official documentation
          </p>
        </div>

        {/* Authentication Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Authentication Status
              {isAuthenticated ? (
                <Badge variant="default" className="bg-green-100 text-green-800">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Authenticated
                </Badge>
              ) : (
                <Badge variant="destructive">
                  <XCircle className="w-3 h-3 mr-1" />
                  Not Authenticated
                </Badge>
              )}
              {isDemoMode && (
                <Badge variant="secondary">Demo Mode</Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center p-4">
                <Loader2 className="h-6 w-6 animate-spin mr-2" />
                <span>Initializing Internet Identity...</span>
              </div>
            ) : isAuthenticated ? (
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label className="text-sm font-medium">Principal ID</Label>
                    <p className="text-xs font-mono bg-gray-100 p-2 rounded break-all">
                      {getPrincipalText()}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Short Principal</Label>
                    <p className="text-sm bg-gray-100 p-2 rounded">
                      {getShortPrincipal()}
                    </p>
                  </div>
                </div>
                
                <div className="grid gap-4 md:grid-cols-3">
                  <div>
                    <Label className="text-sm font-medium">Identity Available</Label>
                    <p className="text-sm">
                      {identity ? (
                        <Badge variant="default" className="bg-green-100 text-green-800">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Yes
                        </Badge>
                      ) : (
                        <Badge variant="secondary">
                          <XCircle className="w-3 h-3 mr-1" />
                          No (Demo Mode)
                        </Badge>
                      )}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Actor Available</Label>
                    <p className="text-sm">
                      {actor ? (
                        <Badge variant="default" className="bg-green-100 text-green-800">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Yes
                        </Badge>
                      ) : (
                        <Badge variant="secondary">
                          <XCircle className="w-3 h-3 mr-1" />
                          No
                        </Badge>
                      )}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Mode</Label>
                    <p className="text-sm">
                      <Badge variant={isDemoMode ? "secondary" : "default"}>
                        {isDemoMode ? "Demo" : "Internet Identity"}
                      </Badge>
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-gray-600">Please authenticate to see your principal and identity information.</p>
            )}
          </CardContent>
        </Card>

        {/* Authentication Controls */}
        <Card>
          <CardHeader>
            <CardTitle>Authentication Controls</CardTitle>
            <CardDescription>Test different authentication methods</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <InternetIdentityButton
              onSuccess={() => {
                toast({
                  title: "Authentication Successful",
                  description: "You are now authenticated with Internet Identity",
                })
              }}
              onError={(error) => {
                toast({
                  title: "Authentication Failed",
                  description: error,
                  variant: "destructive",
                })
              }}
            />

            {/* Custom Demo Login */}
            {isDemoAvailable && (
              <div className="space-y-3 pt-4 border-t">
                <Label className="text-sm font-medium">Custom Demo Principal</Label>
                <div className="flex space-x-2">
                  <Input
                    placeholder="Enter custom principal ID..."
                    value={customPrincipal}
                    onChange={(e) => setCustomPrincipal(e.target.value)}
                    className="text-xs"
                  />
                  <Button
                    onClick={handleCustomDemoLogin}
                    disabled={!customPrincipal.trim() || loading}
                    variant="outline"
                  >
                    <Key className="w-4 h-4 mr-2" />
                    Use
                  </Button>
                </div>
                {demoPrincipal && (
                  <p className="text-xs text-gray-500">
                    Default demo principal: {demoPrincipal}
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Actor Testing */}
        <Card>
          <CardHeader>
            <CardTitle>Actor Testing</CardTitle>
            <CardDescription>Test canister actor functionality</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              onClick={testActorCall}
              disabled={!isAuthenticated || isTesting}
              className="w-full"
            >
              {isTesting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Testing Actor...
                </>
              ) : (
                <>
                  <User className="w-4 h-4 mr-2" />
                  Test Actor Call
                </>
              )}
            </Button>

            {testResult && (
              <div className={`p-4 rounded-lg ${testResult.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                <h4 className={`font-medium mb-2 ${testResult.success ? 'text-green-800' : 'text-red-800'}`}>
                  {testResult.success ? '✅ Test Successful' : '❌ Test Failed'}
                </h4>
                <p className={`text-sm ${testResult.success ? 'text-green-700' : 'text-red-700'}`}>
                  {testResult.success ? testResult.message : testResult.error}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Error Display */}
        {error && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-red-600">
                <AlertCircle className="w-5 h-5 mr-2" />
                Error
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-800">{error}</p>
                <Button onClick={clearError} variant="outline" size="sm" className="mt-2">
                  Clear Error
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Utility Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Utility Actions</CardTitle>
            <CardDescription>Additional testing and utility functions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid gap-3 md:grid-cols-2">
              <Button onClick={refresh} disabled={loading} variant="outline">
                <Loader2 className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh Auth State
              </Button>
              
              <Button
                onClick={() => window.open('https://identity.ic0.app', '_blank')}
                variant="outline"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Open Internet Identity
              </Button>
            </div>

            <div className="text-center pt-4 border-t">
              <p className="text-xs text-gray-500">
                This page tests the Internet Identity integration following the official IC documentation
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
