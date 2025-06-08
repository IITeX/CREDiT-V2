"use client"

import type React from "react"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { RoleSelection } from "./role-selection"
import { OrganizationForm } from "./organization-form"
import { Loader2, Mail, Lock, User, Shield, CheckCircle } from "lucide-react"

interface RegisterFormProps {
  onToggleMode: () => void
}

type Step = "role" | "basic" | "organization" | "verification" | "success"

export function RegisterForm({ onToggleMode }: RegisterFormProps) {
  const [step, setStep] = useState<Step>("role")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    role: "",
    email: "",
    password: "",
    fullName: "",
    organizationName: "",
    organizationType: "",
    website: "",
    documents: [] as File[],
  })
  const supabase = createClient()

  const handleRoleSelect = (role: string) => {
    setFormData((prev) => ({ ...prev, role }))
    setStep("basic")
  }

  const handleBasicSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.role === "organization" || formData.role === "verifier") {
      setStep("organization")
    } else {
      await handleFinalSubmit()
    }
  }

  const handleOrganizationSubmit = (orgData: any) => {
    setFormData((prev) => ({ ...prev, ...orgData }))
    setStep("verification")
  }

  const handleFinalSubmit = async () => {
    setLoading(true)
    setError("")

    try {
      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
      })

      if (authError) {
        setError(authError.message)
        return
      }

      if (authData.user) {
        // Create profile
        const { error: profileError } = await supabase.from("profiles").insert({
          id: authData.user.id,
          email: formData.email,
          full_name: formData.fullName,
          role: formData.role as any,
          organization_name: formData.organizationName || null,
          organization_type: formData.organizationType || null,
          website: formData.website || null,
          verification_status: formData.role === "individual" ? "verified" : "pending",
        })

        if (profileError) {
          setError(profileError.message)
          return
        }

        setStep("success")
      }
    } catch (error) {
      setError("An unexpected error occurred")
    } finally {
      setLoading(false)
    }
  }

  if (step === "role") {
    return <RoleSelection onRoleSelect={handleRoleSelect} onToggleMode={onToggleMode} />
  }

  if (step === "organization") {
    return <OrganizationForm role={formData.role} onSubmit={handleOrganizationSubmit} onBack={() => setStep("basic")} />
  }

  if (step === "verification") {
    return (
      <Card className="w-full max-w-md mx-auto bg-white/90 backdrop-blur-lg border border-green-200 shadow-xl">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-yellow-100">
            <Shield className="h-6 w-6 text-yellow-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-green-800">Verification Required</CardTitle>
          <CardDescription className="text-green-600">
            Your account is pending verification by our admin team
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center space-y-2">
            <p className="text-sm text-gray-600">
              We'll review your organization details and documents within 24-48 hours.
            </p>
            <p className="text-sm text-gray-600">You'll receive an email notification once your account is verified.</p>
          </div>
          <Button
            onClick={handleFinalSubmit}
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 text-white"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating Account...
              </>
            ) : (
              "Complete Registration"
            )}
          </Button>
          {error && (
            <Alert className="border-red-200 bg-red-50">
              <AlertDescription className="text-red-800">{error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    )
  }

  if (step === "success") {
    return (
      <Card className="w-full max-w-md mx-auto bg-white/90 backdrop-blur-lg border border-green-200 shadow-xl">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
            <CheckCircle className="h-6 w-6 text-green-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-green-800">Registration Complete!</CardTitle>
          <CardDescription className="text-green-600">
            {formData.role === "individual"
              ? "Welcome to CREDiT! You can now start building your decentralized resume."
              : "Your account has been created and is pending verification."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={onToggleMode} className="w-full bg-green-600 hover:bg-green-700 text-white">
            Sign In to Your Account
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md mx-auto bg-white/90 backdrop-blur-lg border border-green-200 shadow-xl">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
          <User className="h-6 w-6 text-green-600" />
        </div>
        <CardTitle className="text-2xl font-bold text-green-800">Create Account</CardTitle>
        <CardDescription className="text-green-600">Enter your basic information</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleBasicSubmit} className="space-y-4">
          {error && (
            <Alert className="border-red-200 bg-red-50">
              <AlertDescription className="text-red-800">{error}</AlertDescription>
            </Alert>
          )}

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
                placeholder="Create a strong password"
                value={formData.password}
                onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
                className="pl-10 border-green-200 focus:border-green-500 focus:ring-green-500"
                required
                minLength={6}
              />
            </div>
          </div>

          <Button type="submit" disabled={loading} className="w-full bg-green-600 hover:bg-green-700 text-white">
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating Account...
              </>
            ) : (
              "Continue"
            )}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-green-600">
            Already have an account?{" "}
            <button onClick={onToggleMode} className="font-medium text-green-700 hover:text-green-800 underline">
              Sign in
            </button>
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
