"use client"

import { useState, useEffect } from "react"
import type { ReactNode } from "react"
import { useAuth } from "@/contexts/auth-context"
import { useUserManagement } from "@/hooks/useIC"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { LoginButton } from "./login-button"
import { ICPRegistrationForm } from "./icp-registration-form"
import { Loader2, Shield, AlertCircle } from "lucide-react"

interface AuthGuardProps {
  children: ReactNode
  fallback?: ReactNode
  requireRegistration?: boolean
  allowedRoles?: string[]
}

export function AuthGuard({ children, fallback, requireRegistration = true, allowedRoles }: AuthGuardProps) {
  const { isAuthenticated, loading: authLoading, principal, error: authError } = useAuth()
  const { user, getMyProfile, loading: userLoading } = useUserManagement()

  const [authState, setAuthState] = useState<'checking' | 'login-required' | 'registration-required' | 'authorized' | 'unauthorized'>('checking')
  const [error, setError] = useState("")

  useEffect(() => {
    const checkAuthState = async () => {
      if (authLoading) return

      // Not authenticated with Internet Identity
      if (!isAuthenticated || !principal) {
        setAuthState('login-required')
        return
      }

      // Check if this is the admin principal - always allow access for admin
      const adminPrincipal = "g5pqo-7ihb2-4vqek-pou4f-pauhm-tfylr-qcvnb-f5fnp-lfjs5-i7xtv-pae"
      if (principal?.toString() === adminPrincipal) {
        console.log('Admin principal detected - granting immediate access')
        setAuthState('authorized')
        return
      }

      // Skip profile check if registration is not required
      if (!requireRegistration) {
        setAuthState('authorized')
        return
      }

      // Check if user is registered in our system
      try {
        const profile = await getMyProfile()
        
        if (profile) {
          // Check role permissions if specified
          if (allowedRoles && profile.role) {
            const userRole = Object.keys(profile.role)[0]
            if (!allowedRoles.includes(userRole)) {
              setAuthState('unauthorized')
              setError(`Access denied. Required roles: ${allowedRoles.join(', ')}`)
              return
            }
          }
          
          setAuthState('authorized')
        } else {
          setAuthState('registration-required')
        }
      } catch (err: any) {
        console.error('Auth check error:', err)

        // In development mode, be more lenient with backend errors
        if (process.env.NODE_ENV === 'development') {
          console.log('Development mode: allowing access despite backend error')
          // Check if this is the admin principal - if so, allow access
          const adminPrincipal = "g5pqo-7ihb2-4vqek-pou4f-pauhm-tfylr-qcvnb-f5fnp-lfjs5-i7xtv-pae"
          if (principal?.toString() === adminPrincipal) {
            console.log('Admin principal detected - allowing access')
            setAuthState('authorized')
          } else {
            setAuthState('registration-required')
          }
        } else {
          // In production, require proper registration
          if (err.message?.includes('User not found') || err.message?.includes('NotFound')) {
            setAuthState('registration-required')
          } else {
            // Other errors in production - still allow access but log the error
            setAuthState('authorized')
          }
        }
      }
    }

    checkAuthState()
  }, [isAuthenticated, principal, authLoading, requireRegistration, allowedRoles, getMyProfile])

  const handleRegistrationSuccess = () => {
    setAuthState('authorized')
  }

  // Loading state
  if (authState === 'checking' || authLoading || userLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Checking authentication...</p>
        </div>
      </div>
    )
  }

  // Login required
  if (authState === 'login-required') {
    return (
      fallback || (
        <div className="flex items-center justify-center min-h-[400px] p-6">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Authentication Required</CardTitle>
              <CardDescription>Please log in with Internet Identity to access your dResume dashboard</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {(error || authError) && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    {error || authError?.message || "Authentication failed"}
                  </AlertDescription>
                </Alert>
              )}

              <LoginButton className="w-full" size="lg" showError={false} />
              <div className="text-center">
                <p className="text-xs text-muted-foreground">
                  Your identity is secured by the Internet Computer Protocol
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )
    )
  }

  // Registration required
  if (authState === 'registration-required') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 p-4">
        <div className="w-full max-w-4xl">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-3xl font-bold mb-2">Welcome to dResume</h1>
            <p className="text-muted-foreground">
              Complete your registration to start managing verifiable credentials
            </p>
          </div>
          
          <ICPRegistrationForm onSuccess={handleRegistrationSuccess} />
        </div>
      </div>
    )
  }

  // Unauthorized (role mismatch)
  if (authState === 'unauthorized') {
    return (
      <div className="flex items-center justify-center min-h-[400px] p-6">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="h-6 w-6 text-red-600" />
            </div>
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>
              You don't have permission to access this page
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <Button onClick={() => window.location.href = '/dashboard'} className="w-full">
              Return to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Authorized - show the protected content
  return <>{children}</>
}
