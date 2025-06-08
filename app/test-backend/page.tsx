"use client"

import { useState, useEffect } from 'react'
import { useCredentials } from '@/hooks/useIC'
import { useAuth } from '@/contexts/auth-context'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Loader2, RefreshCw } from 'lucide-react'

export default function TestBackendPage() {
  const { isAuthenticated, principal } = useAuth()
  const { getAllCredentials, loading } = useCredentials()
  const [credentials, setCredentials] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchCredentials = async () => {
    if (!isAuthenticated) {
      setError('Not authenticated')
      return
    }

    setIsLoading(true)
    setError(null)
    
    try {
      console.log('🔍 Fetching all credentials from backend...')
      const result = await getAllCredentials()
      console.log('📋 Backend credentials result:', result)
      
      if (Array.isArray(result)) {
        setCredentials(result)
        console.log(`✅ Found ${result.length} credentials in backend`)
      } else {
        setCredentials([])
        console.log('📭 No credentials found or invalid response format')
      }
    } catch (err) {
      console.error('❌ Error fetching credentials:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch credentials')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (isAuthenticated) {
      fetchCredentials()
    }
  }, [isAuthenticated])

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardHeader>
            <CardTitle>Backend Test - Not Authenticated</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Please login first to test backend connectivity.</p>
            <Button asChild className="mt-4">
              <a href="/setup-admin">Go to Setup</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Backend Connectivity Test
            <Button 
              onClick={fetchCredentials} 
              disabled={isLoading}
              variant="outline"
              size="sm"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
              Refresh
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p><strong>Principal:</strong> {principal?.toString()}</p>
            <p><strong>Status:</strong> <Badge variant="outline">Connected to Real Backend</Badge></p>
          </div>

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700">❌ Error: {error}</p>
            </div>
          )}

          <div>
            <h3 className="text-lg font-semibold mb-3">
              All Credentials in Backend ({credentials.length})
            </h3>
            
            {isLoading ? (
              <div className="flex items-center justify-center p-8">
                <Loader2 className="h-8 w-8 animate-spin" />
                <span className="ml-2">Loading credentials...</span>
              </div>
            ) : credentials.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <p>No credentials found in backend</p>
                <p className="text-sm mt-2">Try creating a credential first</p>
                <Button asChild className="mt-4">
                  <a href="/dashboard">Go to Dashboard</a>
                </Button>
              </div>
            ) : (
              <div className="grid gap-4">
                {credentials.map((credential, index) => (
                  <Card key={index} className="border-l-4 border-l-blue-500">
                    <CardContent className="p-4">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <strong>Token ID:</strong> {credential.tokenId || 'N/A'}
                        </div>
                        <div>
                          <strong>Title:</strong> {credential.title || 'N/A'}
                        </div>
                        <div>
                          <strong>Type:</strong> {credential.credentialType || 'N/A'}
                        </div>
                        <div>
                          <strong>Owner:</strong> {credential.owner?.toString() || 'N/A'}
                        </div>
                        <div className="col-span-2">
                          <strong>Description:</strong> {credential.description || 'N/A'}
                        </div>
                        <div className="col-span-2">
                          <strong>Raw Data:</strong>
                          <pre className="mt-1 p-2 bg-gray-100 rounded text-xs overflow-auto">
                            {JSON.stringify(credential, null, 2)}
                          </pre>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          <div className="pt-4 border-t">
            <h4 className="font-semibold mb-2">Quick Actions:</h4>
            <div className="flex gap-2">
              <Button asChild variant="outline">
                <a href="/dashboard">Create Credential</a>
              </Button>
              <Button asChild variant="outline">
                <a href="/">Test Search</a>
              </Button>
              <Button asChild variant="outline">
                <a href="/test-credential-nft">NFT Test Page</a>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
