"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { AuthMethods } from "@/components/auth/auth-methods"
import { EmailAuthForm } from "@/components/auth/email-auth-form"
import { VerifierRoleSelection } from "@/components/auth/verifier-role-selection"
import { useAuth } from "@/contexts/auth-context"
import { Shield } from "lucide-react"

type AuthStep = "methods" | "email" | "role-selection" | "organization-form"
type AuthMode = "signin" | "signup"

export default function AuthPage() {
  const [step, setStep] = useState<AuthStep>("methods")
  const [mode, setMode] = useState<AuthMode>("signin")
  const [userData, setUserData] = useState<any>(null)
  const { isAuthenticated, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (isAuthenticated && !loading) {
      router.push("/dashboard")
    }
  }, [isAuthenticated, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto" />
          <p className="text-green-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (isAuthenticated) {
    return null // Will redirect
  }

  const handleEmailAuth = () => {
    setStep("email")
  }

  const handleGoogleAuth = async () => {
    // Simulate Google auth
    console.log("Google auth initiated")
    if (mode === "signup") {
      setUserData({ authMethod: "google", email: "user@gmail.com" })
      setStep("role-selection")
    } else {
      router.push("/dashboard")
    }
  }

  const handleInternetIdentityAuth = async () => {
    // For signup, redirect to the comprehensive signup flow
    if (mode === "signup") {
      router.push("/signup")
    } else {
      // For signin, stay on this page and use the login button
      console.log("Internet Identity signin initiated")
    }
  }

  const handleEmailAuthSuccess = (data?: any) => {
    if (mode === "signup" && data) {
      setUserData(data)
      setStep("role-selection")
    } else {
      router.push("/dashboard")
    }
  }

  const handleRoleSelect = (role: string) => {
    console.log("Selected role:", role)
    // Here you would typically save the role and proceed to organization form
    // For now, we'll just redirect to dashboard
    router.push("/dashboard")
  }

  const handleContinueAsIndividual = () => {
    console.log("Continuing as individual")
    router.push("/dashboard")
  }

  const handleToggleMode = () => {
    setMode(mode === "signin" ? "signup" : "signin")
    setStep("methods")
    setUserData(null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-20 h-20 bg-green-200/30 rounded-full blur-xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-emerald-200/30 rounded-full blur-xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-teal-200/30 rounded-full blur-xl animate-pulse delay-500" />
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-6xl">
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <div className="p-3 bg-green-100 rounded-full mr-3">
                <Shield className="h-8 w-8 text-green-600" />
              </div>
              <h1 className="text-4xl font-bold text-green-800">CREDiT</h1>
            </div>
            <p className="text-lg text-green-600 max-w-2xl mx-auto">Decentralized Proof-of-Skills Resume Platform</p>
          </motion.div>

          {/* Auth Flow */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex justify-center"
          >
            {step === "methods" && (
              <AuthMethods
                mode={mode}
                onEmailAuth={handleEmailAuth}
                onGoogleAuth={handleGoogleAuth}
                onInternetIdentityAuth={handleInternetIdentityAuth}
                onToggleMode={handleToggleMode}
              />
            )}

            {step === "email" && (
              <EmailAuthForm mode={mode} onBack={() => setStep("methods")} onSuccess={handleEmailAuthSuccess} />
            )}

            {step === "role-selection" && (
              <VerifierRoleSelection
                onBack={() => setStep(mode === "signup" ? "email" : "methods")}
                onRoleSelect={handleRoleSelect}
                onContinueAsIndividual={handleContinueAsIndividual}
              />
            )}
          </motion.div>

          {/* Development Login Helper */}
          {step === "methods" && process.env.NODE_ENV === "development" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-8 text-center"
            >
              <button
                onClick={() => {
                  localStorage.setItem('dev_principal', 'g5pqo-7ihb2-4vqek-pou4f-pauhm-tfylr-qcvnb-f5fnp-lfjs5-i7xtv-pae')
                  window.location.reload()
                }}
                className="text-sm text-gray-500 hover:text-gray-700 underline"
              >
                🔧 Enable Dev Login (Development Only)
              </button>
            </motion.div>
          )}

          {/* Features */}
          {step === "methods" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto"
            >
              {[
                {
                  title: "Tamper-Proof",
                  description: "Credentials stored on blockchain",
                  icon: "🔒",
                },
                {
                  title: "Verifiable",
                  description: "Instantly verify authenticity",
                  icon: "✅",
                },
                {
                  title: "Portable",
                  description: "Own and control your data",
                  icon: "🚀",
                },
              ].map((feature, index) => (
                <div
                  key={feature.title}
                  className="text-center p-6 bg-white/60 backdrop-blur-sm rounded-lg border border-green-200"
                >
                  <div className="text-3xl mb-2">{feature.icon}</div>
                  <h3 className="font-semibold text-green-800 mb-1">{feature.title}</h3>
                  <p className="text-sm text-green-600">{feature.description}</p>
                </div>
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}
