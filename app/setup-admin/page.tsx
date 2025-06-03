"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/contexts/auth-context"
import { useUserManagement } from "@/hooks/useIC"
import { LoginButton } from "@/components/auth/login-button"
import { enableDevLogin } from "@/lib/auth"
import { 
  Shield, 
  CheckCircle, 
  AlertCircle, 
  Loader2, 
  User, 
  Settings,
  Crown
} from "lucide-react"

export default function AdminSetupPage() {
  const { isAuthenticated, principal, refreshAuth } = useAuth()
  const { registerUser, getMyProfile, updateVerificationStatus, getAllUsers } = useUserManagement()

  const [isLoading, setIsLoading] = useState(false)
  const [status, setStatus] = useState<'idle' | 'checking' | 'registering' | 'approving' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')
  const [userInfo, setUserInfo] = useState<any>(null)

  const ADMIN_PRINCIPAL = "g5pqo-7ihb2-4vqek-pou4f-pauhm-tfylr-qcvnb-f5fnp-lfjs5-i7xtv-pae"

  const clearAuthAndRestart = async () => {
    setIsLoading(true)
    setMessage('Clearing authentication state...')

    try {
      // Clear any existing auth state
      localStorage.removeItem('dev_principal')
      await refreshAuth()
      setMessage('Authentication cleared. You can now start fresh.')
    } catch (error) {
      console.error('Clear auth error:', error)
      setMessage('❌ Failed to clear auth state.')
    } finally {
      setIsLoading(false)
    }
  }

  const useDevLogin = async () => {
    setIsLoading(true)
    setMessage('Setting up dev login...')

    try {
      // Use the current principal from the page (the one shown in the UI)
      const currentPrincipal = "g5pqo-7ihb2-4vqek-pou4f-pauhm-tfylr-qcvnb-f5fnp-lfjs5-i7xtv-pae"

      if (enableDevLogin(currentPrincipal)) {
        setMessage('Dev login enabled! Refreshing authentication...')
        await refreshAuth()
        setMessage('✅ Dev login successful! You can now register your identity.')
      } else {
        setMessage('❌ Failed to enable dev login.')
      }
    } catch (error) {
      console.error('Dev login error:', error)
      setMessage('❌ Dev login failed.')
    } finally {
      setIsLoading(false)
    }
  }

  const checkUserStatus = async () => {
    if (!principal) return
    
    setIsLoading(true)
    setStatus('checking')
    setMessage('Checking user status...')
    
    try {
      const profile = await getMyProfile()
      if (profile) {
        setUserInfo(profile)
        const verificationStatus = profile.verificationStatus ? Object.keys(profile.verificationStatus)[0] : 'Unknown'
        setMessage(`User found! Status: ${verificationStatus}`)
        
        if (verificationStatus === 'Approved') {
          setStatus('success')
          setMessage('✅ You are already set up as a verified admin user!')
        } else {
          setStatus('idle')
          setMessage(`User exists but status is: ${verificationStatus}. You can approve yourself below.`)
        }
      } else {
        setStatus('idle')
        setMessage('User not found in backend. You need to register first.')
      }
    } catch (error: any) {
      console.error('Error checking user:', error)
      setStatus('idle')
      setMessage('User not found in backend. You need to register first.')
    } finally {
      setIsLoading(false)
    }
  }

  const setupAdminUser = async () => {
    if (!principal) return
    
    setIsLoading(true)
    setStatus('registering')
    setMessage('Registering admin user...')
    
    try {
      // Step 1: Register the user
      const roleObj = { Company: null }
      const result = await registerUser(
        "admin@dresume.app",
        roleObj,
        "dResume Admin"
      )
      
      if (result) {
        setMessage('✅ User registered successfully!')
        setStatus('approving')
        setMessage('Setting verification status to approved...')
        
        // Step 2: Approve the user (this requires admin privileges)
        // Since we're the admin principal, this should work
        const statusObj = { Approved: null }
        const approveResult = await updateVerificationStatus(
          principal.toString(),
          statusObj
        )
        
        if (approveResult) {
          setStatus('success')
          setMessage('🎉 Admin user setup complete! You can now access the dashboard and admin panel.')
          
          // Refresh user info
          setTimeout(() => {
            checkUserStatus()
          }, 1000)
        } else {
          setStatus('error')
          setMessage('❌ Failed to approve user. You may need to approve manually from another admin account.')
        }
      } else {
        setStatus('error')
        setMessage('❌ Failed to register user.')
      }
    } catch (error: any) {
      console.error('Setup error:', error)
      setStatus('error')
      setMessage(`❌ Setup failed: ${error.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  const approveMyself = async () => {
    if (!principal) return
    
    setIsLoading(true)
    setStatus('approving')
    setMessage('Approving your account...')
    
    try {
      const statusObj = { Approved: null }
      const result = await updateVerificationStatus(
        principal.toString(),
        statusObj
      )
      
      if (result) {
        setStatus('success')
        setMessage('🎉 Account approved! You can now access the dashboard and admin panel.')
        
        // Refresh user info
        setTimeout(() => {
          checkUserStatus()
        }, 1000)
      } else {
        setStatus('error')
        setMessage('❌ Failed to approve account.')
      }
    } catch (error: any) {
      console.error('Approval error:', error)
      setStatus('error')
      setMessage(`❌ Approval failed: ${error.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  const isAdminPrincipal = principal?.toString() === ADMIN_PRINCIPAL

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Crown className="h-8 w-8 text-amber-600" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Admin Setup</h1>
          <p className="text-muted-foreground">
            Set up your admin account to access the dResume admin panel
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Settings className="h-5 w-5 mr-2" />
              Admin Account Setup
            </CardTitle>
            <CardDescription>
              Register and verify your admin account to access the dashboard
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {!isAuthenticated ? (
              <div className="text-center space-y-4">
                <Alert>
                  <Shield className="h-4 w-4" />
                  <AlertDescription>
                    Please login with Internet Identity to continue, or use dev login for testing
                  </AlertDescription>
                </Alert>
                <div className="space-y-2">
                  <LoginButton className="w-full" />
                  <div className="text-sm text-gray-500">or</div>
                  <Button
                    onClick={useDevLogin}
                    disabled={isLoading}
                    variant="outline"
                    className="w-full"
                  >
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Settings className="h-4 w-4 mr-2" />
                    )}
                    Use Dev Login (Testing)
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Principal Info */}
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Your Principal ID:</p>
                      <p className="text-xs font-mono text-gray-600">{principal?.toString()}</p>
                    </div>
                    <Badge variant={isAdminPrincipal ? "default" : "secondary"}>
                      {isAdminPrincipal ? "Admin Principal" : "Not Admin"}
                    </Badge>
                  </div>
                </div>

                {!isAdminPrincipal && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      Warning: Your principal ID does not match the configured admin principal. 
                      You may not have admin privileges.
                    </AlertDescription>
                  </Alert>
                )}

                {/* Status Message */}
                {message && (
                  <Alert variant={status === 'error' ? 'destructive' : 'default'}>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{message}</AlertDescription>
                  </Alert>
                )}

                {/* User Info */}
                {userInfo && (
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-medium mb-2">Current User Info:</h4>
                    <div className="text-sm space-y-1">
                      <p><strong>Email:</strong> {userInfo.email}</p>
                      <p><strong>Role:</strong> {userInfo.role ? Object.keys(userInfo.role)[0] : 'Unknown'}</p>
                      <p><strong>Organization:</strong> {userInfo.organizationName || 'None'}</p>
                      <p><strong>Status:</strong> {userInfo.verificationStatus ? Object.keys(userInfo.verificationStatus)[0] : 'Unknown'}</p>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col space-y-3">
                  <Button 
                    onClick={checkUserStatus} 
                    disabled={isLoading}
                    variant="outline"
                    className="w-full"
                  >
                    {isLoading && status === 'checking' ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <User className="h-4 w-4 mr-2" />
                    )}
                    Check User Status
                  </Button>

                  {(!userInfo || (userInfo && Object.keys(userInfo.verificationStatus || {})[0] !== 'Approved')) && (
                    <>
                      <Button 
                        onClick={setupAdminUser} 
                        disabled={isLoading || !isAdminPrincipal}
                        className="w-full"
                      >
                        {isLoading && (status === 'registering' || status === 'approving') ? (
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                          <Crown className="h-4 w-4 mr-2" />
                        )}
                        {userInfo ? 'Approve My Account' : 'Register & Approve Admin User'}
                      </Button>

                      {userInfo && (
                        <Button 
                          onClick={approveMyself} 
                          disabled={isLoading || !isAdminPrincipal}
                          variant="outline"
                          className="w-full"
                        >
                          {isLoading && status === 'approving' ? (
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          ) : (
                            <CheckCircle className="h-4 w-4 mr-2" />
                          )}
                          Just Approve (Already Registered)
                        </Button>
                      )}
                    </>
                  )}

                  {status === 'success' && (
                    <div className="flex space-x-2">
                      <Button asChild className="flex-1">
                        <a href="/dashboard">Go to Dashboard</a>
                      </Button>
                      <Button asChild variant="outline" className="flex-1">
                        <a href="/admin">Go to Admin Panel</a>
                      </Button>
                    </div>
                  )}

                  {status === 'error' && (
                    <Button
                      onClick={clearAuthAndRestart}
                      disabled={isLoading}
                      variant="outline"
                      className="w-full"
                    >
                      {isLoading ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <Settings className="h-4 w-4 mr-2" />
                      )}
                      Clear Auth & Start Fresh
                    </Button>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
