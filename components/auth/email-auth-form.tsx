"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, Mail, Lock, User, Loader2 } from "lucide-react"

interface EmailAuthFormProps {
  mode: "signin" | "signup"
  onBack: () => void
  onSuccess: (userData?: any) => void
}

export function EmailAuthForm({ mode, onBack, onSuccess }: EmailAuthFormProps) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    fullName: "",
    confirmPassword: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      if (mode === "signup") {
        if (formData.password !== formData.confirmPassword) {
          setError("Passwords don't match")
          return
        }
        // Simulate signup success and proceed to role selection
        await new Promise((resolve) => setTimeout(resolve, 1000))
        onSuccess({
          email: formData.email,
          fullName: formData.fullName,
          authMethod: "email",
        })
      } else {
        // Simulate signin
        await new Promise((resolve) => setTimeout(resolve, 1000))
        onSuccess()
      }
    } catch (error) {
      setError("Authentication failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto bg-white/95 backdrop-blur-lg border border-green-200 shadow-xl">
      <CardHeader>
        <div className="flex items-center mb-2">
          <Button variant="ghost" size="icon" onClick={onBack} className="mr-2">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <CardTitle className="text-xl font-bold text-green-800">
              {mode === "signin" ? "Sign In" : "Create Account"}
            </CardTitle>
            <CardDescription className="text-green-600">
              {mode === "signin" ? "Enter your credentials" : "Enter your details"}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert className="border-red-200 bg-red-50">
              <AlertDescription className="text-red-800">{error}</AlertDescription>
            </Alert>
          )}

          {mode === "signup" && (
            <div className="space-y-2">
              <Label htmlFor="fullName" className="text-green-700">
                Full Name
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-green-500" />
                <Input
                  id="fullName"
                  type="text"
                  placeholder="Enter your full name"
                  value={formData.fullName}
                  onChange={(e) => setFormData((prev) => ({ ...prev, fullName: e.target.value }))}
                  className="pl-10 border-green-200 focus:border-green-500 focus:ring-green-500"
                  required
                />
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email" className="text-green-700">
              Email
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-green-500" />
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                className="pl-10 border-green-200 focus:border-green-500 focus:ring-green-500"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-green-700">
              Password
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-green-500" />
              <Input
                id="password"
                type="password"
                placeholder={mode === "signin" ? "Enter your password" : "Create a strong password"}
                value={formData.password}
                onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
                className="pl-10 border-green-200 focus:border-green-500 focus:ring-green-500"
                required
                minLength={6}
              />
            </div>
          </div>

          {mode === "signup" && (
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-green-700">
                Confirm Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-green-500" />
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData((prev) => ({ ...prev, confirmPassword: e.target.value }))}
                  className="pl-10 border-green-200 focus:border-green-500 focus:ring-green-500"
                  required
                  minLength={6}
                />
              </div>
            </div>
          )}

          <Button type="submit" disabled={loading} className="w-full bg-green-600 hover:bg-green-700 text-white">
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {mode === "signin" ? "Signing in..." : "Creating account..."}
              </>
            ) : mode === "signin" ? (
              "Sign In"
            ) : (
              "Continue"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
