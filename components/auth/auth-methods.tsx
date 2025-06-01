"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { LoginButton } from "@/components/auth/login-button"
import { Mail, Shield, Chrome } from "lucide-react"

interface AuthMethodsProps {
  mode: "signin" | "signup"
  onEmailAuth: () => void
  onGoogleAuth: () => void
  onInternetIdentityAuth: () => void
  onToggleMode: () => void
}

export function AuthMethods({
  mode,
  onEmailAuth,
  onGoogleAuth,
  onInternetIdentityAuth,
  onToggleMode,
}: AuthMethodsProps) {
  return (
    <Card className="w-full max-w-md mx-auto bg-white/95 backdrop-blur-lg border border-green-200 shadow-xl">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
          <Shield className="h-6 w-6 text-green-600" />
        </div>
        <CardTitle className="text-2xl font-bold text-green-800">
          {mode === "signin" ? "Welcome Back" : "Create Account"}
        </CardTitle>
        <CardDescription className="text-green-600">
          {mode === "signin" ? "Sign in to your dResume account" : "Join the decentralized resume revolution"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Email/Password Option */}
        <Button
          onClick={onEmailAuth}
          variant="outline"
          className="w-full h-12 border-green-200 hover:bg-green-50 text-green-700"
        >
          <Mail className="mr-2 h-4 w-4" />
          {mode === "signin" ? "Sign in with Email" : "Sign up with Email"}
        </Button>

        <Separator className="my-4" />

        {/* Social Auth Options */}
        <div className="space-y-3">
          <Button onClick={onGoogleAuth} variant="outline" className="w-full h-12 border-gray-200 hover:bg-gray-50">
            <Chrome className="mr-2 h-4 w-4" />
            Continue with Google
          </Button>

          {mode === "signin" ? (
            <LoginButton
              className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white"
              onSuccess={() => {
                // On successful login, redirect to dashboard
                window.location.href = "/dashboard"
              }}
            />
          ) : (
            <Button onClick={onInternetIdentityAuth} className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white">
              <Shield className="mr-2 h-4 w-4" />
              Continue with Internet Identity
            </Button>
          )}
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-green-600">
            {mode === "signin" ? "Don't have an account?" : "Already have an account?"}{" "}
            <button onClick={onToggleMode} className="font-medium text-green-700 hover:text-green-800 underline">
              {mode === "signin" ? "Sign up" : "Sign in"}
            </button>
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
