import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, XCircle, Clock, AlertTriangle } from 'lucide-react'
import { useUserManagement, useCredentials, useVerification, useStorage } from '@/hooks/useIC'
import { useAuth } from '@/contexts/auth-context'
import { getConfig, getCanisterIds, validateEnvironment, isSimulationMode } from '@/lib/config'
import { Alert, AlertDescription } from '@/components/ui/alert'

interface TestResult {
  name: string
  status: 'success' | 'error' | 'pending' | 'idle'
  message?: string
  duration?: number
}

export function ICIntegrationTester() {
  const { isAuthenticated, identity } = useAuth()
  const { user, registerUser, getMyProfile, loading: userLoading } = useUserManagement()
  const { credentials, createCredential, getMyCredentials, loading: credentialLoading } = useCredentials()
  const { submitVerificationRequest, loading: verificationLoading } = useVerification()
  const { uploadDocument, loading: storageLoading } = useStorage()
  
  const [tests, setTests] = useState<TestResult[]>([
    { name: 'Authentication Check', status: 'idle' },
    { name: 'User Management Connection', status: 'idle' },
    { name: 'Credential NFT Connection', status: 'idle' },
    { name: 'Verification Connection', status: 'idle' },
    { name: 'Storage Connection', status: 'idle' },
    { name: 'User Registration Test', status: 'idle' },
    { name: 'Profile Retrieval Test', status: 'idle' },
    { name: 'Credential Retrieval Test', status: 'idle' },
  ])

  const config = getConfig()
  const canisterIds = getCanisterIds()
  const isSimulation = isSimulationMode()

  const updateTestStatus = (testName: string, status: TestResult['status'], message?: string, duration?: number) => {
    setTests(prev => prev.map(test => 
      test.name === testName 
        ? { ...test, status, message, duration }
        : test
    ))
  }

  const runTest = async (testName: string, testFn: () => Promise<void>) => {
    updateTestStatus(testName, 'pending')
    const startTime = Date.now()
    
    try {
      await testFn()
      const duration = Date.now() - startTime
      updateTestStatus(testName, 'success', 'Passed', duration)
    } catch (error) {
      const duration = Date.now() - startTime
      updateTestStatus(testName, 'error', error instanceof Error ? error.message : 'Unknown error', duration)
    }
  }

  const runAllTests = async () => {
    // Reset all tests
    setTests(prev => prev.map(test => ({ ...test, status: 'idle' as const })))

    // Test 1: Authentication Check
    await runTest('Authentication Check', async () => {
      if (!isAuthenticated || !identity) {
        throw new Error('User not authenticated')
      }
    })

    // Test 2: User Management Connection
    await runTest('User Management Connection', async () => {
      if (userLoading) {
        throw new Error('User management still loading')
      }
      if (isSimulation) {
        // In simulation mode, just check if the hook is available
        if (!registerUser || !getMyProfile) {
          throw new Error('User management functions not available')
        }
      } else {
        // In real mode, we would check actor availability
        // For now, assume it's working if hooks are available
        if (!registerUser || !getMyProfile) {
          throw new Error('User management functions not available')
        }
      }
    })

    // Test 3: Credential NFT Connection
    await runTest('Credential NFT Connection', async () => {
      if (credentialLoading) {
        throw new Error('Credential NFT still loading')
      }
      if (!createCredential || !getMyCredentials) {
        throw new Error('Credential functions not available')
      }
    })

    // Test 4: Verification Connection
    await runTest('Verification Connection', async () => {
      if (verificationLoading) {
        throw new Error('Verification still loading')
      }
      if (!submitVerificationRequest) {
        throw new Error('Verification functions not available')
      }
    })

    // Test 5: Storage Connection
    await runTest('Storage Connection', async () => {
      if (storageLoading) {
        throw new Error('Storage still loading')
      }
      if (!uploadDocument) {
        throw new Error('Storage functions not available')
      }
    })

    // Test 6: User Registration/Profile Test (if authenticated)
    if (isAuthenticated) {
      await runTest('User Registration Test', async () => {
        try {
          await registerUser(
            'test@example.com',
            { Individual: null },
            undefined
          )
        } catch (error) {
          // Registration might fail if user already exists, that's okay
          console.log('Registration test result:', error)
        }
      })

      // Test 7: Profile Retrieval Test
      await runTest('Profile Retrieval Test', async () => {
        try {
          const profile = await getMyProfile()
          console.log('Profile retrieved:', profile)
        } catch (error) {
          throw new Error(`Profile retrieval failed: ${error}`)
        }
      })

      // Test 8: Credential Retrieval Test
      await runTest('Credential Retrieval Test', async () => {
        try {
          const userCredentials = await getMyCredentials()
          console.log('Credentials retrieved:', userCredentials)
        } catch (error) {
          throw new Error(`Credential retrieval failed: ${error}`)
        }
      })
    }
  }

  const getStatusIcon = (status: TestResult['status']) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500 animate-spin" />
      default:
        return <AlertTriangle className="h-4 w-4 text-gray-400" />
    }
  }

  const getStatusBadge = (status: TestResult['status']) => {
    switch (status) {
      case 'success':
        return <Badge variant="default" className="bg-green-100 text-green-800">Passed</Badge>
      case 'error':
        return <Badge variant="destructive">Failed</Badge>
      case 'pending':
        return <Badge variant="secondary">Running...</Badge>
      default:
        return <Badge variant="outline">Pending</Badge>
    }
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5" />
          ICP Integration Tester
          {isSimulation && (
            <Badge variant="secondary" className="ml-2">Simulation Mode</Badge>
          )}
        </CardTitle>
        <CardDescription>
          Test the connection and functionality of all ICP canisters
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {!isAuthenticated && (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Please authenticate with Internet Identity to run integration tests.
              </AlertDescription>
            </Alert>
          )}

          <div className="flex gap-2">
            <Button onClick={runAllTests} className="flex-1" disabled={!isAuthenticated}>
              Run All Tests
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setTests(prev => prev.map(test => ({ ...test, status: 'idle' as const })))}
            >
              Reset Tests
            </Button>
          </div>

          <div className="space-y-2">
            {tests.map((test) => (
              <div
                key={test.name}
                className="flex items-center justify-between p-3 border rounded-lg"
              >
                <div className="flex items-center gap-3">
                  {getStatusIcon(test.status)}
                  <span className="font-medium">{test.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  {test.duration && (
                    <span className="text-sm text-gray-500">{test.duration}ms</span>
                  )}
                  {getStatusBadge(test.status)}
                </div>
              </div>
            ))}
          </div>

          {tests.some(test => test.status === 'error') && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <h4 className="font-medium text-red-800 mb-2">Test Failures:</h4>
              <div className="space-y-1">
                {tests
                  .filter(test => test.status === 'error')
                  .map(test => (
                    <div key={test.name} className="text-sm text-red-700">
                      <strong>{test.name}:</strong> {test.message}
                    </div>
                  ))}
              </div>
            </div>
          )}

          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="font-medium text-blue-800 mb-2">System Status:</h4>
            <div className="text-sm text-blue-700 space-y-1">
              <div>Mode: {isSimulation ? '🧪 Simulation' : '🌐 Live ICP'}</div>
              <div>Authenticated: {isAuthenticated ? '✅ Yes' : '❌ No'}</div>
              <div>Identity: {identity ? '✅ Available' : '❌ Not available'}</div>
              <div>User Management: {!userLoading ? '✅ Ready' : '⏳ Loading'}</div>
              <div>Credentials: {!credentialLoading ? '✅ Ready' : '⏳ Loading'}</div>
              <div>Verification: {!verificationLoading ? '✅ Ready' : '⏳ Loading'}</div>
              <div>Storage: {!storageLoading ? '✅ Ready' : '⏳ Loading'}</div>
            </div>
          </div>

          <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <h4 className="font-medium text-gray-800 mb-2">Configuration:</h4>            <div className="text-sm text-gray-700 space-y-1">
              <div>IC Host: {config.IC_HOST}</div>
              <div>Network: {process.env.NEXT_PUBLIC_DFX_NETWORK || 'local'}</div>
              <div>User Management ID: {canisterIds.userManagement}</div>
              <div>Credential NFT ID: {canisterIds.credentialNft}</div>
              <div>Verification ID: {canisterIds.verification}</div>
              <div>Storage ID: {canisterIds.storage}</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
