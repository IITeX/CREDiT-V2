'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useAuth } from '@/contexts/auth-context'
import { useUserManagement, useCredentials, useVerification, useStorage } from '@/hooks/useIC'
import { getConfig, getCanisterIds, validateEnvironment, isSimulationMode } from '@/lib/config'
import { Alert, AlertDescription } from '@/components/ui/alert'

export function ICIntegrationTester() {
  const [testResults, setTestResults] = useState<Record<string, any>>({})
  const [isRunning, setIsRunning] = useState(false)
  
  const { isAuthenticated, identity, principal } = useAuth()
  const { user, registerUser, getMyProfile, loading: userLoading } = useUserManagement()
  const { credentials, createCredential, getMyCredentials, loading: credLoading } = useCredentials()
  const { submitVerificationRequest, loading: verifyLoading } = useVerification()
  const { uploadDocument, loading: storageLoading } = useStorage()
  
  const config = getConfig()
  const canisterIds = getCanisterIds()
  const envValidation = validateEnvironment()
  const simulationMode = isSimulationMode()

  const runTest = async (testName: string, testFn: () => Promise<any>) => {
    setIsRunning(true)
    try {
      const result = await testFn()
      setTestResults(prev => ({
        ...prev,
        [testName]: { success: true, result, timestamp: new Date().toISOString() }
      }))
    } catch (error) {
      setTestResults(prev => ({
        ...prev,
        [testName]: { success: false, error: error instanceof Error ? error.message : 'Unknown error', timestamp: new Date().toISOString() }
      }))
    } finally {
      setIsRunning(false)
    }
  }

  const testUserRegistration = () => runTest('userRegistration', async () => {
    if (!isAuthenticated) throw new Error('Not authenticated')
    return await registerUser('test@example.com', { Individual: null })
  })

  const testGetProfile = () => runTest('getProfile', async () => {
    if (!isAuthenticated) throw new Error('Not authenticated')
    return await getMyProfile()
  })

  const testCredentialCreation = () => runTest('credentialCreation', async () => {
    if (!isAuthenticated) throw new Error('Not authenticated')
    return await createCredential(
      { Certificate: null },
      'Test Certificate',
      'This is a test certificate',
      principal?.toText() || '',
      'Test User',
      {},
      [],
      []
    )
  })

  const testGetCredentials = () => runTest('getCredentials', async () => {
    if (!isAuthenticated) throw new Error('Not authenticated')
    return await getMyCredentials()
  })

  const testDocumentUpload = () => runTest('documentUpload', async () => {
    if (!isAuthenticated) throw new Error('Not authenticated')
    const testContent = new TextEncoder().encode('Test document content')
    return await uploadDocument('test.txt', Array.from(testContent), 'text/plain')
  })

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          IC Integration Tester 
          <Badge variant={simulationMode ? "secondary" : "default"}>
            {simulationMode ? "Simulation Mode" : "Live Mode"}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Environment Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="font-medium mb-2">Environment Status</h3>
            <div className="space-y-1 text-sm">
              <p>Mode: <Badge variant={simulationMode ? "secondary" : "default"}>{simulationMode ? "Simulation" : "Live"}</Badge></p>
              <p>Network: {config.IC_HOST}</p>
              <p>Auth Status: <Badge variant={isAuthenticated ? "default" : "destructive"}>{isAuthenticated ? "Connected" : "Disconnected"}</Badge></p>
              {principal && <p>Principal: {principal.toText().slice(0, 8)}...</p>}
            </div>
          </div>
          
          <div>
            <h3 className="font-medium mb-2">Canister IDs</h3>
            <div className="space-y-1 text-xs">
              <p>User: {canisterIds.userManagement.slice(0, 12)}...</p>
              <p>Credential: {canisterIds.credentialNft.slice(0, 12)}...</p>
              <p>Verification: {canisterIds.verification.slice(0, 12)}...</p>
              <p>Storage: {canisterIds.storage.slice(0, 12)}...</p>
            </div>
          </div>
        </div>

        {/* Environment Validation */}
        <Alert variant={envValidation.isValid ? "default" : "destructive"}>
          <AlertDescription>
            Environment Status: {envValidation.isValid ? "✅ Valid" : "❌ Invalid"}
            {!envValidation.isValid && (
              <ul className="mt-2 ml-4 list-disc">
                {envValidation.errors.map((error, idx) => <li key={idx}>{error}</li>)}
              </ul>
            )}
          </AlertDescription>
        </Alert>

        {simulationMode && (
          <Alert>
            <AlertDescription>
              🧪 Simulation Mode Active: All API calls will return mock data. The IC replica does not need to be running.
            </AlertDescription>
          </Alert>
        )}

        {/* Test Controls */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          <Button 
            onClick={testUserRegistration} 
            disabled={!isAuthenticated || isRunning || userLoading}
            size="sm"
          >
            Test User Registration
          </Button>
          
          <Button 
            onClick={testGetProfile} 
            disabled={!isAuthenticated || isRunning || userLoading}
            size="sm"
          >
            Test Get Profile
          </Button>
          
          <Button 
            onClick={testCredentialCreation} 
            disabled={!isAuthenticated || isRunning || credLoading}
            size="sm"
          >
            Test Create Credential
          </Button>
          
          <Button 
            onClick={testGetCredentials} 
            disabled={!isAuthenticated || isRunning || credLoading}
            size="sm"
          >
            Test Get Credentials
          </Button>
          
          <Button 
            onClick={testDocumentUpload} 
            disabled={!isAuthenticated || isRunning || storageLoading}
            size="sm"
          >
            Test Document Upload
          </Button>
          
          <Button 
            onClick={() => setTestResults({})} 
            variant="outline"
            size="sm"
          >
            Clear Results
          </Button>
        </div>

        {/* Test Results */}
        {Object.keys(testResults).length > 0 && (
          <div>
            <h3 className="font-medium mb-2">Test Results</h3>
            <div className="space-y-2">
              {Object.entries(testResults).map(([testName, result]) => (
                <div key={testName} className="p-3 border rounded">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium">{testName}</span>
                    <Badge variant={result.success ? "default" : "destructive"}>
                      {result.success ? "✅ Success" : "❌ Failed"}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">{result.timestamp}</p>
                  <pre className="text-xs bg-muted p-2 rounded overflow-auto max-h-32">
                    {JSON.stringify(result.success ? result.result : result.error, null, 2)}
                  </pre>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Loading State */}
        {(userLoading || credLoading || verifyLoading || storageLoading) && (
          <div className="text-center py-4">
            <p className="text-sm text-muted-foreground">Running test...</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
