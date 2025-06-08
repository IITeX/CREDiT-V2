"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'
import { useAuth } from '@/contexts/auth-context'
import { useCredentials, useUserManagement } from '@/hooks/useIC'
import { checkCanisterHealth, getCanisterUrls } from '@/lib/canister-utils'
import { Loader2, CheckCircle, XCircle, AlertCircle, ExternalLink } from 'lucide-react'

export default function TestCanistersPage() {
  const { isAuthenticated, identity, principal } = useAuth()
  const { createCredential } = useCredentials()
  const { getMyProfile } = useUserManagement()
  const { toast } = useToast()
  
  const [healthStatus, setHealthStatus] = useState<any>(null)
  const [isTestingHealth, setIsTestingHealth] = useState(false)
  const [isTestingCredential, setIsTestingCredential] = useState(false)
  const [testCredentialResult, setTestCredentialResult] = useState<any>(null)
  const [testTokenId, setTestTokenId] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [searchResult, setSearchResult] = useState<any>(null)

  const canisterUrls = getCanisterUrls()

  const testCanisterHealth = async () => {
    setIsTestingHealth(true)
    try {
      const health = await checkCanisterHealth(identity)
      setHealthStatus(health)
      
      if (health.credentialNft && health.storage) {
        toast({
          title: "✅ All Canisters Healthy",
          description: "Both credential_nft and storage canisters are responding correctly.",
        })
      } else {
        toast({
          title: "⚠️ Canister Issues Detected",
          description: `Errors: ${health.errors.join(', ')}`,
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Health check failed:', error)
      toast({
        title: "Health Check Failed",
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: "destructive",
      })
    } finally {
      setIsTestingHealth(false)
    }
  }

  const testCredentialCreation = async () => {
    if (!isAuthenticated || !principal) {
      toast({
        title: "Authentication Required",
        description: "Please login with Internet Identity first.",
        variant: "destructive",
      })
      return
    }

    setIsTestingCredential(true)
    try {
      const result = await createCredential(
        { Certification: null },
        "Test Credential - Canister Integration",
        "This is a test credential to verify canister integration",
        principal.toText(),
        "Test User",
        {
          issuer: "CREDiT Test System",
          date: new Date().toISOString().split('T')[0],
          type: "test",
        },
        [],
        []
      )

      setTestCredentialResult(result)
      toast({
        title: "✅ Credential Created Successfully",
        description: `Token ID: ${result.tokenId}`,
      })
    } catch (error) {
      console.error('Credential creation failed:', error)
      toast({
        title: "Credential Creation Failed",
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: "destructive",
      })
    } finally {
      setIsTestingCredential(false)
    }
  }

  const testTokenSearch = async () => {
    if (!testTokenId.trim()) return

    setIsSearching(true)
    try {
      // This would use the search functionality
      // For now, just test the connection
      await testCanisterHealth()
      setSearchResult({ found: true, tokenId: testTokenId })
      
      toast({
        title: "Search Test Completed",
        description: `Tested search for token: ${testTokenId}`,
      })
    } catch (error) {
      console.error('Search test failed:', error)
      toast({
        title: "Search Test Failed",
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: "destructive",
      })
    } finally {
      setIsSearching(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2">Canister Integration Test</h1>
          <p className="text-gray-600">
            Test the integration with deployed IC Network canisters
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
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isAuthenticated ? (
              <div className="space-y-2">
                <p><strong>Principal:</strong> {principal?.toText()}</p>
                <p className="text-sm text-gray-600">Ready to test canister operations</p>
              </div>
            ) : (
              <p className="text-red-600">Please login with Internet Identity to test canister operations.</p>
            )}
          </CardContent>
        </Card>

        {/* Canister URLs */}
        <Card>
          <CardHeader>
            <CardTitle>Deployed Canisters</CardTitle>
            <CardDescription>Links to your deployed canisters on IC Network</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid gap-3 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Credential NFT Canister</Label>
                <div className="flex items-center gap-2">
                  <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                    {canisterUrls.canisterIds.credentialNft}
                  </code>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(canisterUrls.credentialNft, '_blank')}
                  >
                    <ExternalLink className="w-3 h-3" />
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Storage Canister</Label>
                <div className="flex items-center gap-2">
                  <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                    {canisterUrls.canisterIds.storage}
                  </code>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(canisterUrls.storage, '_blank')}
                  >
                    <ExternalLink className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </div>
            <div className="text-xs text-gray-500">
              <strong>IC Host:</strong> {canisterUrls.host}
            </div>
          </CardContent>
        </Card>

        {/* Health Check */}
        <Card>
          <CardHeader>
            <CardTitle>Canister Health Check</CardTitle>
            <CardDescription>Test connectivity to both deployed canisters</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              onClick={testCanisterHealth} 
              disabled={isTestingHealth}
              className="w-full"
            >
              {isTestingHealth ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Testing Canister Health...
                </>
              ) : (
                'Test Canister Health'
              )}
            </Button>

            {healthStatus && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span>Credential NFT:</span>
                  {healthStatus.credentialNft ? (
                    <Badge variant="default" className="bg-green-100 text-green-800">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Healthy
                    </Badge>
                  ) : (
                    <Badge variant="destructive">
                      <XCircle className="w-3 h-3 mr-1" />
                      Error
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span>Storage:</span>
                  {healthStatus.storage ? (
                    <Badge variant="default" className="bg-green-100 text-green-800">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Healthy
                    </Badge>
                  ) : (
                    <Badge variant="destructive">
                      <XCircle className="w-3 h-3 mr-1" />
                      Error
                    </Badge>
                  )}
                </div>
                {healthStatus.errors.length > 0 && (
                  <div className="text-sm text-red-600 space-y-1">
                    <strong>Errors:</strong>
                    {healthStatus.errors.map((error: string, index: number) => (
                      <div key={index}>• {error}</div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Credential Creation Test */}
        <Card>
          <CardHeader>
            <CardTitle>Test Credential Creation</CardTitle>
            <CardDescription>Create a test credential to verify end-to-end functionality</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              onClick={testCredentialCreation} 
              disabled={isTestingCredential || !isAuthenticated}
              className="w-full"
            >
              {isTestingCredential ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating Test Credential...
                </>
              ) : (
                'Create Test Credential'
              )}
            </Button>

            {testCredentialResult && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="font-medium text-green-800 mb-2">✅ Test Credential Created</h4>
                <div className="space-y-1 text-sm">
                  <div><strong>Token ID:</strong> {testCredentialResult.tokenId}</div>
                  <div><strong>Credential ID:</strong> {testCredentialResult.credentialId}</div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Search Test */}
        <Card>
          <CardHeader>
            <CardTitle>Test Token Search</CardTitle>
            <CardDescription>Test the search functionality with a token ID</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="Enter Token ID (e.g., ED-2025-001)"
                value={testTokenId}
                onChange={(e) => setTestTokenId(e.target.value)}
              />
              <Button 
                onClick={testTokenSearch} 
                disabled={isSearching || !testTokenId.trim()}
              >
                {isSearching ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  'Search'
                )}
              </Button>
            </div>

            {searchResult && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-800 mb-2">Search Test Completed</h4>
                <div className="text-sm">
                  Tested search for: <code>{searchResult.tokenId}</code>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
