"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"

import { useInternetIdentity } from "@/hooks/useInternetIdentity"
import { InternetIdentityButton } from "@/components/auth/internet-identity-button"
import { DocumentUpload } from "@/components/auth/document-upload"
import { aiVerificationSteps } from "@/lib/mock-data"
import {
  User,
  Building,
  GraduationCap,
  Award,
  Heart,
  Globe,
  CheckCircle,
  ArrowLeft,
  ArrowRight,
  Loader2,
  XCircle,
  Shield
} from "lucide-react"

type VerifierRole = "individual" | "educational" | "company" | "certification" | "ngo" | "platform"
type Step = "auth" | "role" | "details" | "documents" | "success"

const verifierRoles = [
  {
    id: "individual" as VerifierRole,
    title: "Individual",
    description: "Personal professional profile",
    icon: User,
    color: "bg-blue-100 text-blue-700",
    requirements: [
      "Personal identification",
      "Professional portfolio",
      "Contact information",
      "Social media verification"
    ]
  },
  {
    id: "educational" as VerifierRole,
    title: "Educational Institution",
    description: "Universities, colleges, schools",
    icon: GraduationCap,
    color: "bg-green-100 text-green-700",
    requirements: [
      "Accreditation documents",
      "Official registration",
      "Academic credentials",
      "Institution verification"
    ]
  },
  {
    id: "company" as VerifierRole,
    title: "Company/Organization",
    description: "Businesses and corporations",
    icon: Building,
    color: "bg-purple-100 text-purple-700",
    requirements: [
      "Business registration",
      "Tax identification",
      "Company profile",
      "Legal documentation"
    ]
  },
  {
    id: "certification" as VerifierRole,
    title: "Certification Body",
    description: "Professional certification providers",
    icon: Award,
    color: "bg-yellow-100 text-yellow-700",
    requirements: [
      "Certification authority license",
      "Accreditation proof",
      "Standards compliance",
      "Quality assurance docs"
    ]
  },
  {
    id: "ngo" as VerifierRole,
    title: "NGO/Non-Profit",
    description: "Non-governmental organizations",
    icon: Heart,
    color: "bg-red-100 text-red-700",
    requirements: [
      "Non-profit registration",
      "Mission statement",
      "Board documentation",
      "Activity reports"
    ]
  },
  {
    id: "platform" as VerifierRole,
    title: "Platform/Marketplace",
    description: "Upwork, Fiverr, GitHub, etc.",
    icon: Globe,
    color: "bg-orange-100 text-orange-700",
    requirements: [
      "Platform API credentials",
      "Official partnership agreement",
      "Integration documentation",
      "Platform verification badge"
    ]
  }
]

export default function SignUp() {
  const [step, setStep] = useState<Step>("auth")
  const [selectedRole, setSelectedRole] = useState<VerifierRole | null>(null)
  const [formData, setFormData] = useState({
    organizationName: "",
    contactEmail: "",
    contactPhone: "",
    website: "",
    address: "",
    description: ""
  })
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [registrationError, setRegistrationError] = useState<string | null>(null)
  const [isVerificationComplete, setIsVerificationComplete] = useState(false)
  const [verificationAttempts, setVerificationAttempts] = useState(0)
  const [isVerificationRunning, setIsVerificationRunning] = useState(false)
  const [currentVerificationStep, setCurrentVerificationStep] = useState(0)
  const [verificationSteps, setVerificationSteps] = useState<any[]>([])

  const { isAuthenticated, principal } = useInternetIdentity()
  const router = useRouter()

  // Auto-advance to role selection once authenticated (Internet Identity only)
  // Dev login advances manually in the button click handler
  useEffect(() => {
    if (isAuthenticated && step === "auth") {
      setStep("role")
    }
  }, [isAuthenticated, step])

  const handleRoleSelect = (role: VerifierRole) => {
    setSelectedRole(role)
    setStep("details")
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setRegistrationError(null)

    if (!selectedRole) {
      console.error("No role selected")
      return
    }

    if (uploadedFiles.length === 0) {
      setRegistrationError("Please upload at least one verification document.")
      return
    }

    console.log("Starting registration with AI verification...")
    console.log("Signup data:", { selectedRole, formData, uploadedFiles })
    console.log("User authenticated:", isAuthenticated)
    console.log("Principal:", principal?.toText())
    console.log("Authentication method:", isAuthenticated ? "Internet Identity" : "Dev Login")

    setIsLoading(true)
    setIsVerificationRunning(true)
    setVerificationAttempts(prev => prev + 1)

    try {
      // Simulate AI verification process with step-by-step display
      console.log(`AI Verification Attempt ${verificationAttempts + 1}`)

      // First attempt: Fail with step-by-step process
      if (verificationAttempts === 0) {
        // Show first 2 steps, then fail
        const failureSteps = [
          aiVerificationSteps[0], // Analyzing uploaded document...
          { ...aiVerificationSteps[1], status: 'error' as const } // Upload Failed: Not a Document
        ]

        for (let i = 0; i < failureSteps.length; i++) {
          setCurrentVerificationStep(i)
          setVerificationSteps(failureSteps.slice(0, i + 1))
          await new Promise(resolve => setTimeout(resolve, 1500))
        }

        setIsVerificationRunning(false)
        setRegistrationError("AI Verification Failed: Document uploaded is not a valid document. Please check your files and try again.")
        setIsLoading(false)
        return
      }

      // Second attempt: Success with full step process
      if (verificationAttempts === 1) {
        // Show all steps successfully
        for (let i = 0; i < aiVerificationSteps.length; i++) {
          setCurrentVerificationStep(i)
          setVerificationSteps(aiVerificationSteps.slice(0, i + 1))
          await new Promise(resolve => setTimeout(resolve, 1500))
        }

        setIsVerificationRunning(false)
        setIsVerificationComplete(true)

        // Continue with registration after successful verification
        await new Promise(resolve => setTimeout(resolve, 1000))
        setStep("success")
      }

    } catch (error) {
      console.error("Registration failed:", error)
      setRegistrationError("Registration failed. Please try again.")
      setIsVerificationRunning(false)
    } finally {
      setIsLoading(false)
    }
  }

  const selectedRoleData = selectedRole ? verifierRoles.find(r => r.id === selectedRole) : null

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Progress Indicator */}
        <div className="mb-8">
          {/* Authentication Method Indicator */}
          {step !== "auth" && (
            <div className="text-center mb-4">
              <div className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                <Shield className="w-3 h-3 mr-1" />
                {isAuthenticated ? "Internet Identity" : "Dev Login"}
              </div>
            </div>
          )}

          <div className="flex items-center justify-center space-x-4">
            {["auth", "role", "details", "documents", "success"].map((stepName, index) => (
              <div key={stepName} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step === stepName 
                    ? "bg-green-600 text-white" 
                    : index < ["auth", "role", "details", "documents", "success"].indexOf(step)
                    ? "bg-green-200 text-green-800"
                    : "bg-gray-200 text-gray-500"
                }`}>
                  {index < ["auth", "role", "details", "documents", "success"].indexOf(step) ? (
                    <CheckCircle className="w-4 h-4" />
                  ) : (
                    index + 1
                  )}
                </div>
                {index < 4 && (
                  <div className={`w-12 h-1 mx-2 ${
                    index < ["auth", "role", "details", "documents", "success"].indexOf(step)
                      ? "bg-green-200"
                      : "bg-gray-200"
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step 1: Authentication */}
        {step === "auth" && (
          <Card className="bg-white/90 backdrop-blur-lg border border-green-200 shadow-xl">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-bold text-green-800">Join CREDiT</CardTitle>
              <CardDescription className="text-green-600">
                Create your verified professional profile on the blockchain
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center space-y-6">
              <div className="text-center w-full max-w-md">
                <p className="text-gray-600 mb-6">
                  Choose your authentication method to get started
                </p>

                {/* Internet Identity Option */}
                <div className="space-y-4">
                  <div className="border rounded-lg p-4 bg-white">
                    <h3 className="font-semibold text-gray-900 mb-2">Internet Identity (Recommended)</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Secure blockchain-based authentication
                    </p>
                    <InternetIdentityButton
                      size="lg"
                      className="bg-green-600 hover:bg-green-700 w-full"
                      onSuccess={() => {
                        console.log("✅ Internet Identity login successful for signup")
                        // The useEffect will handle advancing to the next step
                      }}
                      onError={(error) => {
                        console.error("❌ Internet Identity login failed:", error)
                        setRegistrationError(`Authentication failed: ${error}`)
                      }}
                      showDemo={true}
                      showError={true}
                    />
                  </div>

                  {/* Dev Login Option */}
                  <div className="border rounded-lg p-4 bg-blue-50 border-blue-200">
                    <h3 className="font-semibold text-blue-900 mb-2">Development Login</h3>
                    <p className="text-sm text-blue-700 mb-4">
                      Quick access for testing and development
                    </p>
                    <Button
                      onClick={() => {
                        console.log("✅ Dev login selected for signup")
                        // Simulate successful authentication
                        setStep("role")
                      }}
                      variant="outline"
                      size="lg"
                      className="w-full border-blue-300 text-blue-700 hover:bg-blue-100"
                    >
                      Continue with Dev Login
                    </Button>
                  </div>
                </div>

                {/* Authentication Error Display */}
                {registrationError && step === "auth" && (
                  <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-700">{registrationError}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Role Selection */}
        {step === "role" && (
          <Card className="bg-white/90 backdrop-blur-lg border border-green-200 shadow-xl">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-bold text-green-800">Choose Your Role</CardTitle>
              <CardDescription className="text-green-600">
                Select the type of verifier you want to become
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {verifierRoles.map((role) => {
                  const IconComponent = role.icon
                  return (
                    <motion.div
                      key={role.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Card
                        className="cursor-pointer border-2 hover:border-green-300 transition-all duration-200"
                        onClick={() => handleRoleSelect(role.id)}
                      >
                        <CardHeader className="text-center pb-2">
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2 ${role.color}`}>
                            <IconComponent className="w-6 h-6" />
                          </div>
                          <CardTitle className="text-lg">{role.title}</CardTitle>
                          <CardDescription className="text-sm">{role.description}</CardDescription>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <div className="space-y-1">
                            <p className="text-xs font-medium text-gray-600 mb-2">Requirements:</p>
                            {role.requirements.slice(0, 2).map((req, index) => (
                              <p key={index} className="text-xs text-gray-500">• {req}</p>
                            ))}
                            {role.requirements.length > 2 && (
                              <p className="text-xs text-gray-400">+ {role.requirements.length - 2} more</p>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Organization Details */}
        {step === "details" && selectedRoleData && (
          <Card className="bg-white/90 backdrop-blur-lg border border-green-200 shadow-xl">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${selectedRoleData.color}`}>
                  <selectedRoleData.icon className="w-5 h-5" />
                </div>
                <div>
                  <CardTitle>{selectedRoleData.title} Registration</CardTitle>
                  <CardDescription>
                    Provide your {selectedRole === "individual" ? "personal" : "organization"} details for verification
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={(e) => { e.preventDefault(); setStep("documents") }} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="organizationName">
                      {selectedRole === "individual" ? "Full Name" : "Organization Name"} *
                    </Label>
                    <Input
                      id="organizationName"
                      name="organizationName"
                      placeholder={selectedRole === "individual" ? "Enter your full name" : "Enter organization name"}
                      value={formData.organizationName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contactEmail">Contact Email *</Label>
                    <Input
                      id="contactEmail"
                      name="contactEmail"
                      type="email"
                      placeholder="Enter contact email"
                      value={formData.contactEmail}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contactPhone">Phone Number</Label>
                    <Input
                      id="contactPhone"
                      name="contactPhone"
                      type="tel"
                      placeholder="Enter phone number"
                      value={formData.contactPhone}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="website">Website</Label>
                    <Input
                      id="website"
                      name="website"
                      type="url"
                      placeholder="https://example.com"
                      value={formData.website}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    name="address"
                    placeholder="Enter full address"
                    value={formData.address}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder={selectedRole === "individual"
                      ? "Tell us about your professional background..."
                      : "Describe your organization's mission and activities..."
                    }
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={4}
                  />
                </div>

                {/* Requirements Display */}
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2 text-blue-800">Verification Requirements</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {selectedRoleData.requirements.map((req, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-blue-600" />
                        <span className="text-sm text-blue-700">{req}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between pt-4">
                  <Button type="button" variant="outline" onClick={() => setStep("role")}>
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                  </Button>
                  <Button type="submit">
                    Next: Upload Documents
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Step 4: Document Upload */}
        {step === "documents" && selectedRoleData && (
          <Card className="bg-white/90 backdrop-blur-lg border border-green-200 shadow-xl">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${selectedRoleData.color}`}>
                  <selectedRoleData.icon className="w-5 h-5" />
                </div>
                <div>
                  <CardTitle>Upload Verification Documents</CardTitle>
                  <CardDescription>
                    Upload the required documents for {selectedRoleData.title.toLowerCase()} verification
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Requirements Checklist */}
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-3 text-yellow-800">Required Documents</h4>
                  <div className="space-y-2">
                    {selectedRoleData.requirements.map((req, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <div className="w-4 h-4 rounded border border-yellow-400 bg-white" />
                        <span className="text-sm text-yellow-700">{req}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* File Upload */}
                <DocumentUpload
                  onFilesChange={setUploadedFiles}
                  acceptedTypes={[".pdf", ".jpg", ".jpeg", ".png", ".doc", ".docx"]}
                  maxFiles={10}
                  maxSize={25 * 1024 * 1024} // 25MB
                />

                {/* AI Verification Status */}
                {isVerificationRunning && (
                  <Card className="border-blue-200 bg-blue-50">
                    <CardContent className="p-4">
                      <div className="space-y-4">
                        <div className="flex items-center space-x-3">
                          <Loader2 className="h-5 w-5 text-blue-600 animate-spin" />
                          <div>
                            <p className="font-medium text-blue-800">AI Verification in Progress</p>
                            <p className="text-sm text-blue-700">
                              Analyzing your documents... Attempt {verificationAttempts}
                            </p>
                          </div>
                        </div>

                        {/* Verification Progress Bar */}
                        {verificationSteps.length > 0 && (
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium text-blue-800">Verification Progress</span>
                              <span className="text-sm text-blue-600">
                                {verificationSteps[currentVerificationStep]?.progress || 0}%
                              </span>
                            </div>
                            <Progress
                              value={verificationSteps[currentVerificationStep]?.progress || 0}
                              className="h-2"
                            />
                          </div>
                        )}

                        {/* Verification Steps Progress */}
                        {verificationSteps.length > 0 && (
                          <div className="space-y-2">
                            <div className="text-sm font-medium text-blue-800">Verification Log</div>
                            <div className="space-y-1 max-h-32 overflow-y-auto">
                              {verificationSteps.map((step, index) => (
                                <div
                                  key={index}
                                  className={`flex items-center space-x-2 p-2 rounded text-xs ${
                                    index === currentVerificationStep ? 'bg-blue-100 border border-blue-300' : 'bg-gray-50'
                                  }`}
                                >
                                  {step.status === 'processing' && <Loader2 className="h-3 w-3 animate-spin text-blue-600" />}
                                  {step.status === 'success' && <CheckCircle className="h-3 w-3 text-green-600" />}
                                  {step.status === 'error' && <XCircle className="h-3 w-3 text-red-600" />}
                                  <span className="flex-1">{step.message}</span>
                                  <span className="text-gray-400">
                                    {new Date().toLocaleTimeString()}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Verification Success */}
                {isVerificationComplete && (
                  <Card className="border-green-200 bg-green-50">
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        <div>
                          <p className="font-medium text-green-800">Documents Verified Successfully!</p>
                          <p className="text-sm text-green-700">
                            Your documents have been validated by our AI system.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* AI Verification Notice */}
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2 text-blue-800">AI Verification Process</h4>
                  <p className="text-sm text-blue-700">
                    When you submit your application, our AI system will automatically verify your documents.
                    This process analyzes document authenticity, content validation, and fraud detection.
                  </p>
                </div>

                {registrationError && (
                  <div className="bg-red-50 p-4 rounded-lg">
                    <p className="text-sm text-red-700">{registrationError}</p>
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <div className="flex justify-between pt-4">
                    <Button type="button" variant="outline" onClick={() => setStep("details")}>
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Back
                    </Button>
                    <Button
                      type="submit"
                      disabled={uploadedFiles.length === 0 || isLoading}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      {isLoading ? (
                        isVerificationRunning ? "AI Verifying Documents..." : "Creating Account..."
                      ) : (
                        verificationAttempts === 0 ? "Submit Application" : "Retry Submission"
                      )}
                      {!isLoading && <ArrowRight className="w-4 h-4 ml-2" />}
                    </Button>
                  </div>
                </form>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 5: Success */}
        {step === "success" && (
          <Card className="bg-white/90 backdrop-blur-lg border border-green-200 shadow-xl">
            <CardContent className="text-center py-12">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", duration: 0.5 }}
              >
                <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
              </motion.div>
              <CardTitle className="text-3xl font-bold text-green-800 mb-4">
                Application Submitted!
              </CardTitle>
              <CardDescription className="text-lg text-green-600 mb-6">
                Your {selectedRoleData?.title.toLowerCase()} verification application has been submitted successfully.
              </CardDescription>
              <div className="bg-green-50 p-4 rounded-lg mb-6">
                <p className="text-sm text-green-700">
                  <strong>What's next?</strong><br />
                  • Our AI system has verified your documents<br />
                  • You can now access your {selectedRole === "individual" ? "dashboard" : "issuer dashboard"}<br />
                  • Start {selectedRole === "individual" ? "creating credentials" : "issuing tokens"} right away<br />
                  • Authentication: {isAuthenticated ? "Internet Identity" : "Development Login"}
                </p>
              </div>
              <Button
                onClick={() => {
                  // Navigate based on user role
                  if (selectedRole === "individual") {
                    router.push("/dashboard")
                  } else {
                    router.push("/issuer-dashboard")
                  }
                }}
                className="bg-green-600 hover:bg-green-700"
              >
                Go to {selectedRole === "individual" ? "Dashboard" : "Issuer Dashboard"}
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
