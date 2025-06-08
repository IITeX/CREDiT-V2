"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { useInternetIdentity } from "@/hooks/useInternetIdentity"
import { Loader2, Shield, AlertCircle, CheckCircle, Globe, Key } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { cn } from "@/lib/utils"

interface InternetIdentityButtonProps {
  className?: string
  variant?: "default" | "outline" | "secondary" | "ghost" | "link" | "destructive"
  size?: "default" | "sm" | "lg" | "icon"
  showError?: boolean
  showDemo?: boolean
  onSuccess?: () => void
  onError?: (error: string) => void
}

export function InternetIdentityButton({
  className,
  variant = "default",
  size = "default",
  showError = true,
  showDemo = true,
  onSuccess,
  onError
}: InternetIdentityButtonProps) {
  const {
    isAuthenticated,
    loading,
    error,
    isDemoMode,
    login,
    loginDemo,
    logout,
    getShortPrincipal,
    clearError,
    isDemoAvailable,
    demoPrincipal
  } = useInternetIdentity()

  const [isLoggingIn, setIsLoggingIn] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  // Handle successful authentication
  useEffect(() => {
    if (isAuthenticated && isLoggingIn) {
      setIsLoggingIn(false)
      setShowSuccess(true)
      onSuccess?.()

      // Clear success message after 3 seconds
      const timer = setTimeout(() => setShowSuccess(false), 3000)
      return () => clearTimeout(timer)
    }
  }, [isAuthenticated, isLoggingIn, onSuccess])

  const handleInternetIdentityLogin = async () => {
    setIsLoggingIn(true)
    clearError()
    setShowSuccess(false)

    try {
      console.log('🔐 Button: Starting Internet Identity login...')
      const success = await login()
      console.log('🔐 Button: Login result:', success)

      if (!success) {
        const errorMsg = error || "Failed to authenticate with Internet Identity"
        console.error('❌ Button: Login failed:', errorMsg)
        onError?.(errorMsg)
      } else {
        console.log('✅ Button: Login successful!')
      }
    } catch (err) {
      console.error("❌ Button: Login error:", err)
      const errorMsg = err instanceof Error ? err.message : "An unexpected error occurred during login"
      onError?.(errorMsg)
    } finally {
      // Don't set isLoggingIn to false here - let the useEffect handle it
    }
  }

  const handleDemoLogin = async () => {
    setIsLoggingIn(true)
    clearError()
    setShowSuccess(false)

    try {
      const success = await loginDemo()
      if (!success) {
        onError?.(error || "Failed to authenticate with demo credentials")
      }
    } catch (err) {
      console.error("❌ Demo login error:", err)
      onError?.("An unexpected error occurred during demo login")
    } finally {
      // Don't set isLoggingIn to false here - let the useEffect handle it
    }
  }

  const handleLogout = async () => {
    try {
      await logout()
    } catch (err) {
      console.error("❌ Logout error:", err)
    }
  }

  const isDisabled = loading || isLoggingIn

  // Show success state
  if (isAuthenticated && showSuccess) {
    return (
      <Button disabled variant="outline" size={size} className={cn(className)}>
        <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
        Connected! {isDemoMode && "(Demo)"}
      </Button>
    )
  }

  // Show authenticated state with logout option
  if (isAuthenticated) {
    return (
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <Button disabled variant="outline" size={size} className={cn("flex-1", className)}>
            <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
            {getShortPrincipal()} {isDemoMode && "(Demo)"}
          </Button>
          <Button onClick={handleLogout} variant="ghost" size="sm">
            Logout
          </Button>
        </div>
      </div>
    )
  }

  // Show login options
  return (
    <div className="space-y-3">
      {/* Internet Identity Login */}
      <Button
        onClick={handleInternetIdentityLogin}
        disabled={isDisabled}
        variant={variant}
        size={size}
        className={cn("w-full", className)}
      >
        {isLoggingIn ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Connecting to Internet Identity...
          </>
        ) : (
          <>
            <Globe className="mr-2 h-4 w-4" />
            Login with Internet Identity
          </>
        )}
      </Button>

      {/* Demo Login (if available and enabled) */}
      {showDemo && isDemoAvailable && demoPrincipal && (
        <>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or for testing
              </span>
            </div>
          </div>

          <Button
            onClick={handleDemoLogin}
            disabled={isDisabled}
            variant="outline"
            size={size}
            className={cn("w-full", className)}
          >
            {isLoggingIn ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Connecting with demo...
              </>
            ) : (
              <>
                <Key className="mr-2 h-4 w-4" />
                Demo Login
              </>
            )}
          </Button>
        </>
      )}

      {/* Error Display */}
      {showError && error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error}
            <div className="mt-2 space-y-2">
              <div className="text-sm text-muted-foreground">
                If you're having trouble with Internet Identity:
              </div>
              <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
                <li>Make sure popups are allowed for this site</li>
                <li>Try in incognito/private mode</li>
                <li>Clear your browser cache and cookies</li>
                <li>Use the demo login as a backup</li>
              </ul>
              <div className="flex space-x-2 mt-2">
                <a
                  href="https://identity.ic0.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:text-blue-800 underline"
                >
                  Create Internet Identity
                </a>
                <span className="text-sm text-muted-foreground">•</span>
                <a
                  href="https://internetcomputer.org/docs/building-apps/authentication/integrate-internet-identity"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:text-blue-800 underline"
                >
                  Help & Documentation
                </a>
              </div>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Info about Internet Identity */}
      <div className="text-center">
        <p className="text-xs text-muted-foreground">
          Internet Identity provides secure, passwordless authentication
        </p>
      </div>
    </div>
  )
}

// Backward compatibility export
export { InternetIdentityButton as LoginButton }
