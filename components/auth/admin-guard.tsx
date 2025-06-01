"use client"

import { useState, useEffect } from "react"
import type { ReactNode } from "react"
import { useAuth } from "@/contexts/auth-context"
import { useUserManagement } from "@/hooks/useIC"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { LoginButton } from "./login-button"
import { Loader2, Shield, AlertCircle, Lock } from "lucide-react"

interface AdminGuardProps {
  children: ReactNode
  fallback?: ReactNode
}

export function AdminGuard({ children, fallback }: AdminGuardProps) {
  const { isAuthenticated, loading: authLoading, principal, error: authError } = useAuth()
  const { user, getMyProfile, loading: userLoading } = useUserManagement()

  const [authState, setAuthState] = useState<'checking' | 'login-required' | 'unauthorized' | 'authorized'>('checking')
  const [error, setError] = useState("")
  const [isCheckingAdmin, setIsCheckingAdmin] = useState(false)

  useEffect(() => {
    async function checkAdminAccess() {
      if (authLoading) return

      if (!isAuthenticated || !principal) {
        setAuthState('login-required')
        return
      }

      setIsCheckingAdmin(true)
      setError("")

      try {
        // Check if user is admin by calling the backend
        // First, get the user management canister
        const canisterId = process.env.NEXT_PUBLIC_USER_MANAGEMENT_CANISTER_ID
        
        if (!canisterId) {
          setError("Admin verification unavailable - canister not configured")
          setAuthState('unauthorized')
          return
        }

        // For now, we'll check if the principal matches the hardcoded admin principal
        // In a real implementation, you'd call the backend to check admin status
        const adminPrincipal = "g5pqo-7ihb2-4vqek-pou4f-pauhm-tfylr-qcvnb-f5fnp-lfjs5-i7xtv-pae"
        
        if (principal.toString() === adminPrincipal) {
          setAuthState('authorized')
        } else {
          setAuthState('unauthorized')
          setError("Access denied. Admin privileges required.")
        }
      } catch (err: any) {
        console.error('Admin check error:', err)
        setError("Failed to verify admin status")
        setAuthState('unauthorized')
      } finally {
        setIsCheckingAdmin(false)
      }
    }

    checkAdminAccess()
  }, [isAuthenticated, principal, authLoading])

  // Loading state
  if (authState === 'checking' || authLoading || isCheckingAdmin) {
    return (
      <div className="flex items-center justify-center min-h-[400px] p-6">
        <Card className="w-full max-w-md">
          <CardContent className="p-6">
            <div className="flex flex-col items-center space-y-4">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <div className="text-center">
                <h3 className="font-semibold">Verifying Access</h3>
                <p className="text-sm text-muted-foreground">
                  Checking admin privileges...
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
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
              <CardTitle>Admin Authentication Required</CardTitle>
              <CardDescription>Please log in with Internet Identity to access the admin dashboard</CardDescription>
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
              <LoginButton className="w-full" />
            </CardContent>
          </Card>
        </div>
      )
    )
  }

  // Unauthorized
  if (authState === 'unauthorized') {
    return (
      <div className="flex items-center justify-center min-h-[400px] p-6">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
              <Lock className="h-6 w-6 text-red-600" />
            </div>
            <CardTitle className="text-red-800">Access Denied</CardTitle>
            <CardDescription>You don't have permission to access the admin dashboard</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {error || "Admin privileges required to access this area"}
              </AlertDescription>
            </Alert>
            <div className="text-center text-sm text-muted-foreground">
              <p>If you believe this is an error, please contact the system administrator.</p>
              <p className="mt-2">Your Principal ID: {principal?.toString()}</p>
            </div>
            <Button variant="outline" className="w-full" onClick={() => window.location.href = '/dashboard'}>
              Return to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Authorized - render children
  return <>{children}</>
}
