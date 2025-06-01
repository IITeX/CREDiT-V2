"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/contexts/auth-context"
import { LoginButton } from "@/components/auth/login-button"
import { DocumentUpload } from "@/components/auth/document-upload"
import { 
  User, 
  Building, 
  GraduationCap, 
  Award, 
  Heart, 
  Globe,
  CheckCircle,
  ArrowLeft,
  ArrowRight
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

  const { isAuthenticated, principal, refreshAuth } = useAuth()
  const router = useRouter()

  // Auto-advance to role selection once authenticated
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

    console.log("Starting registration...")
    console.log("Signup data:", { selectedRole, formData, uploadedFiles })
    console.log("User authenticated:", isAuthenticated)
    console.log("Principal:", principal?.toText())

    setIsLoading(true)

    try {
      // TODO: Implement actual registration with backend
      // For now, simulate success
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      setStep("success")
    } catch (error) {
      console.error("Registration failed:", error)
      setRegistrationError("Registration failed. Please try again.")
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
              <CardTitle className="text-3xl font-bold text-green-800">Join dResume</CardTitle>
              <CardDescription className="text-green-600">
                Create your verified professional profile on the blockchain
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center space-y-6">
              <div className="text-center">
                <p className="text-gray-600 mb-4">
                  Sign in with Internet Identity to get started
                </p>
                <div className="space-y-3">
                  <LoginButton
                    size="lg"
                    className="bg-green-600 hover:bg-green-700 w-full"
                  />

                  {/* Temporary Dev Login Button */}
                  {process.env.NEXT_PUBLIC_ENABLE_DEV_LOGIN === 'true' && (
                    <div className="space-y-2">
                      <Button
                        onClick={async () => {
                          // Use your actual dfx local identity principal
                          const devPrincipal = 'g5pqo-7ihb2-4vqek-pou4f-pauhm-tfylr-qcvnb-f5fnp-lfjs5-i7xtv-pae'
                          localStorage.setItem('dev_principal', devPrincipal)
                          console.log("🔧 Dev login enabled for signup with dfx principal:", devPrincipal)
                          // Force auth context to refresh immediately
                          await refreshAuth()
                        }}
                        variant="outline"
                        size="lg"
                        className="w-full border-orange-300 text-orange-700 hover:bg-orange-50"
                      >
                        🔧 Dev Login (DFX Identity)
                      </Button>

                      <p className="text-xs text-gray-500 text-center">
                        Run <code className="bg-gray-100 px-1 rounded">dfx identity get-principal</code> in WSL to get your principal
                      </p>
                    </div>
                  )}
                </div>
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

                {/* AI Verification Notice */}
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2 text-blue-800">AI Verification Process</h4>
                  <p className="text-sm text-blue-700">
                    Your documents will be processed by our AI verification system. This may take 24-48 hours.
                    You'll receive an email notification once verification is complete.
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
                      {isLoading ? "Creating Account..." : "Submit Application"}
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
                  • Our AI system will review your documents<br />
                  • You'll receive an email notification within 24-48 hours<br />
                  • Once approved, you can start issuing and verifying credentials
                </p>
              </div>
              <Button
                onClick={() => router.push("/dashboard")}
                className="bg-green-600 hover:bg-green-700"
              >
                Go to Dashboard
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
