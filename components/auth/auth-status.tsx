"use client"

import { useAuth } from "@/contexts/auth-context"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { formatPrincipal, getDevPrincipal } from "@/lib/auth"
import { Shield, Loader2, AlertCircle, CheckCircle, Wrench } from "lucide-react"

interface AuthStatusProps {
  showDetails?: boolean
  className?: string
}

export function AuthStatus({ showDetails = false, className }: AuthStatusProps) {
  const { isAuthenticated, principal, loading, error } = useAuth()
  const isDevLogin = getDevPrincipal() !== null

  if (loading) {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
        <span className="text-sm text-muted-foreground">Checking authentication...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        <AlertCircle className="h-4 w-4 text-destructive" />
        <span className="text-sm text-destructive">Authentication Error</span>
        {showDetails && (
          <Badge variant="destructive" className="text-xs">
            {error.type}
          </Badge>
        )}
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        <Shield className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm text-muted-foreground">Not authenticated</span>
      </div>
    )
  }

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <CheckCircle className="h-4 w-4 text-green-500" />
      <span className="text-sm text-green-700">
        {isDevLogin ? "Dev Login" : "Authenticated"}
      </span>
      {isDevLogin && <Wrench className="h-3 w-3 text-orange-500" />}
      {showDetails && principal && (
        <Badge variant="outline" className="text-xs font-mono">
          {formatPrincipal(principal)}
        </Badge>
      )}
    </div>
  )
}

// Detailed auth status card
export function AuthStatusCard() {
  const { isAuthenticated, principal, loading, error } = useAuth()
  const isDevLogin = getDevPrincipal() !== null

  return (
    <Card>
      <CardContent className="p-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium">Authentication Status</h3>
            <AuthStatus />
          </div>
          
          {isAuthenticated && principal && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Principal ID:</span>
                <code className="font-mono bg-muted px-1 py-0.5 rounded">
                  {formatPrincipal(principal)}
                </code>
              </div>
              
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Auth Method:</span>
                <div className="flex items-center space-x-1">
                  <span>{isDevLogin ? "Development" : "Internet Identity"}</span>
                  {isDevLogin && <Wrench className="h-3 w-3 text-orange-500" />}
                </div>
              </div>
            </div>
          )}
          
          {error && (
            <div className="text-xs text-destructive bg-destructive/10 p-2 rounded">
              <div className="font-medium">{error.type}</div>
              <div>{error.message}</div>
            </div>
          )}
          
          {loading && (
            <div className="text-xs text-muted-foreground">
              Checking authentication status...
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
