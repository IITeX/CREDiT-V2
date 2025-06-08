"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { useInternetIdentity } from "@/hooks/useInternetIdentity"
import { Shield, LogIn, User, AlertCircle, CheckCircle, Loader2, Key, Globe, ExternalLink } from "lucide-react"

export default function AuthPage() {
  const router = useRouter()
  const { toast } = useToast()
  const {
    isAuthenticated,
    principal,
    loading,
    error,
    isDemoMode,
    login,
    loginDemo,
    logout,
    getPrincipalText,
    getShortPrincipal,
    clearError,
    isDemoAvailable,
    demoPrincipal
  } = useInternetIdentity()

  const [customPrincipal, setCustomPrincipal] = useState("")
  const [isLoggingIn, setIsLoggingIn] = useState(false)

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && !loading) {
      toast({
        title: "Already Authenticated",
        description: `Welcome back! Principal: ${getShortPrincipal()}`,
      })
      router.push("/dashboard")
    }
  }, [isAuthenticated, loading, router, toast, getShortPrincipal])

  const handleInternetIdentityLogin = async () => {
    setIsLoggingIn(true)
    clearError()

    try {
      const success = await login()
      if (success) {
        toast({
          title: "Login Successful",
          description: "You have been authenticated with Internet Identity",
        })
        router.push("/dashboard")
      } else {
        toast({
          title: "Login Failed",
          description: error || "Failed to authenticate with Internet Identity",
          variant: "destructive",
        })
      }
    } catch (err) {
      console.error("Login error:", err)
      toast({
        title: "Login Error",
        description: "An unexpected error occurred during login",
        variant: "destructive",
      })
    } finally {
      setIsLoggingIn(false)
    }
  }

  const handleDemoLogin = async (principal?: string) => {
    setIsLoggingIn(true)
    clearError()

    try {
      const success = await loginDemo(principal)
      if (success) {
        toast({
          title: "Demo Login Successful",
          description: "You are now logged in with demo credentials",
        })
        router.push("/dashboard")
      } else {
        toast({
          title: "Demo Login Failed",
          description: error || "Failed to authenticate with demo credentials",
          variant: "destructive",
        })
      }
    } catch (err) {
      console.error("Demo login error:", err)
      toast({
        title: "Demo Login Error",
        description: "An unexpected error occurred during demo login",
        variant: "destructive",
      })
    } finally {
      setIsLoggingIn(false)
    }
  }

  const handleLogout = async () => {
    try {
      await logout()
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out",
      })
    } catch (err) {
      console.error("Logout error:", err)
      toast({
        title: "Logout Error",
        description: "An error occurred during logout",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="flex items-center justify-center p-8">
            <div className="text-center space-y-4">
              <Loader2 className="h-8 w-8 animate-spin mx-auto text-green-600" />
              <p className="text-muted-foreground">Initializing authentication...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Welcome to CREDiT</h1>
          <p className="text-muted-foreground">
            Secure authentication with Internet Identity
          </p>
        </div>

        {isAuthenticated ? (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CheckCircle className="h-5 w-5 mr-2 text-green-600" />
                Authenticated
              </CardTitle>
              <CardDescription>
                You are currently logged in
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-green-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Principal ID:</span>
                  {isDemoMode && (
                    <Badge variant="secondary" className="text-xs">
                      Demo Mode
                    </Badge>
                  )}
                </div>
                <p className="text-xs font-mono text-gray-600 break-all">
                  {getPrincipalText()}
                </p>
              </div>

              <div className="space-y-2">
                <Button onClick={() => router.push("/dashboard")} className="w-full">
                  <User className="h-4 w-4 mr-2" />
                  Go to Dashboard
                </Button>
                <Button onClick={handleLogout} variant="outline" className="w-full">
                  <LogIn className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <LogIn className="h-5 w-5 mr-2" />
                Sign In
              </CardTitle>
              <CardDescription>
                Choose your authentication method
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center">
                    <AlertCircle className="h-4 w-4 text-red-600 mr-2" />
                    <p className="text-sm text-red-800">{error}</p>
                  </div>
                </div>
              )}

              {/* Internet Identity Login */}
              <div className="space-y-3">
                <Button
                  onClick={handleInternetIdentityLogin}
                  disabled={isLoggingIn}
                  className="w-full h-12"
                  size="lg"
                >
                  {isLoggingIn ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Globe className="h-4 w-4 mr-2" />
                  )}
                  Sign in with Internet Identity
                </Button>
                
                <div className="flex items-center justify-center">
                  <Button
                    variant="link"
                    size="sm"
                    onClick={() => window.open("https://identity.ic0.app", "_blank")}
                    className="text-xs text-muted-foreground"
                  >
                    <ExternalLink className="h-3 w-3 mr-1" />
                    Create Internet Identity
                  </Button>
                </div>
              </div>

              {/* Demo Login Section */}
              {isDemoAvailable && (
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

                  <div className="space-y-3">
                    {demoPrincipal && (
                      <Button
                        onClick={() => handleDemoLogin()}
                        disabled={isLoggingIn}
                        variant="outline"
                        className="w-full"
                      >
                        {isLoggingIn ? (
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                          <Key className="h-4 w-4 mr-2" />
                        )}
                        Demo Login
                      </Button>
                    )}

                    <div className="space-y-2">
                      <Label htmlFor="customPrincipal" className="text-sm">
                        Custom Principal (Advanced)
                      </Label>
                      <div className="flex space-x-2">
                        <Input
                          id="customPrincipal"
                          placeholder="Enter principal ID..."
                          value={customPrincipal}
                          onChange={(e) => setCustomPrincipal(e.target.value)}
                          className="text-xs"
                        />
                        <Button
                          onClick={() => handleDemoLogin(customPrincipal)}
                          disabled={isLoggingIn || !customPrincipal.trim()}
                          variant="outline"
                          size="sm"
                        >
                          Use
                        </Button>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* Info Section */}
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="text-sm font-medium mb-2">About Internet Identity</h4>
                <p className="text-xs text-muted-foreground">
                  Internet Identity is a secure, privacy-preserving authentication system 
                  built on the Internet Computer. No passwords, no tracking, just secure access.
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
