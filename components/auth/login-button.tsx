"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context"
import { Loader2, Shield, AlertCircle, CheckCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface LoginButtonProps {
  className?: string
  variant?: "default" | "outline" | "secondary" | "ghost" | "link" | "destructive"
  size?: "default" | "sm" | "lg" | "icon"
  showError?: boolean
  onSuccess?: () => void
  onError?: (error: string) => void
}

export function LoginButton({
  className,
  variant = "default",
  size = "default",
  showError = true,
  onSuccess,
  onError
}: LoginButtonProps) {
  const { login, loading, error, clearError, isAuthenticated } = useAuth()
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

  const handleLogin = async () => {
    setIsLoggingIn(true)
    clearError() // Clear any previous errors
    setShowSuccess(false)

    try {
      const success = await login()
      if (!success && error) {
        onError?.(error.message)
      }
    } catch (err) {
      console.error("❌ Login error:", err)
      onError?.("An unexpected error occurred during login")
    } finally {
      // Don't set isLoggingIn to false here - let the useEffect handle it
      // This prevents the button from flickering between states
    }
  }

  const isDisabled = loading || isLoggingIn || isAuthenticated

  if (isAuthenticated && showSuccess) {
    return (
      <Button disabled variant="outline" size={size} className={className}>
        <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
        Connected!
      </Button>
    )
  }

  if (isAuthenticated) {
    return null // Don't show login button if already authenticated
  }

  return (
    <div className="space-y-2">
      <Button
        onClick={handleLogin}
        disabled={isDisabled}
        variant={variant}
        size={size}
        className={className}
      >
        {isLoggingIn ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Connecting to Internet Identity...
          </>
        ) : (
          <>
            <Shield className="mr-2 h-4 w-4" />
            Login with Internet Identity
          </>
        )}
      </Button>

      {showError && error && (
        <Alert variant="destructive" className="mt-2">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error.message}
            {error.type === 'USER_CANCELLED' && (
              <div className="mt-1 text-sm text-muted-foreground">
                Please try again and complete the Internet Identity authentication.
              </div>
            )}
            {error.type === 'NETWORK_ERROR' && (
              <div className="mt-1 text-sm text-muted-foreground">
                Please check your internet connection and try again.
              </div>
            )}
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}
