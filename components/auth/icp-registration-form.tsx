"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, User, Building, GraduationCap, Heart, Shield } from "lucide-react"
import { useUserManagement } from "@/hooks/useIC"
import { useAuth } from "@/contexts/auth-context"

interface ICPRegistrationFormProps {
  onSuccess?: () => void
  onBack?: () => void
}

export function ICPRegistrationForm({ onSuccess, onBack }: ICPRegistrationFormProps) {
  const [step, setStep] = useState<"role" | "details">("role")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  
  const [selectedRole, setSelectedRole] = useState("")
  const [formData, setFormData] = useState({
    email: "",
    organizationName: "",
  })

  const { registerUser } = useUserManagement()
  const { principal } = useAuth()

  const roles = [
    {
      id: "Individual",
      title: "Individual User",
      description: "Personal credential management",
      icon: User,
      color: "bg-blue-100 text-blue-700",
    },
    {
      id: "Educational",
      title: "Educational Institution",
      description: "Universities, schools, training centers",
      icon: GraduationCap,
      color: "bg-green-100 text-green-700",
    },
    {
      id: "Company",
      title: "Company/Employer",
      description: "Businesses and corporations",
      icon: Building,
      color: "bg-purple-100 text-purple-700",
    },
    {
      id: "Certification",
      title: "Certification Body",
      description: "Professional certification authorities",
      icon: Shield,
      color: "bg-orange-100 text-orange-700",
    },
    {
      id: "NGO",
      title: "NGO/Non-Profit",
      description: "Non-profit organizations",
      icon: Heart,
      color: "bg-red-100 text-red-700",
    },
  ]

  const handleRoleSelect = (roleId: string) => {
    setSelectedRole(roleId)
    setStep("details")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!principal) {
      setError("Not authenticated with Internet Identity")
      return
    }

    setLoading(true)
    setError("")

    try {
      // Create role object for backend
      const roleObject = { [selectedRole]: null }
      
      const result = await registerUser(
        formData.email,
        roleObject,
        formData.organizationName || undefined
      )

      if (result) {
        onSuccess?.()
      }
    } catch (err: any) {
      setError(err.message || "Registration failed")
    } finally {
      setLoading(false)
    }
  }

  if (step === "role") {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <CardTitle>Choose Your Role</CardTitle>
          <CardDescription>
            Select your primary role to get started with dResume
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <Alert>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <div className="grid gap-4 md:grid-cols-2">
            {roles.map((role) => {
              const IconComponent = role.icon
              return (
                <Card
                  key={role.id}
                  className="cursor-pointer transition-all hover:shadow-lg border-2 hover:border-primary"
                  onClick={() => handleRoleSelect(role.id)}
                >
                  <CardContent className="p-6 text-center">
                    <div className={`w-12 h-12 rounded-lg ${role.color} flex items-center justify-center mx-auto mb-4`}>
                      <IconComponent className="h-6 w-6" />
                    </div>
                    <h3 className="font-semibold mb-2">{role.title}</h3>
                    <p className="text-sm text-muted-foreground">{role.description}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {onBack && (
            <div className="flex justify-center">
              <Button variant="outline" onClick={onBack}>
                Back
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    )
  }

  const selectedRoleData = roles.find(r => r.id === selectedRole)
  const requiresOrganization = ["Educational", "Company", "Certification", "NGO"].includes(selectedRole)

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle>Complete Registration</CardTitle>
        <CardDescription>
          {selectedRoleData && (
            <div className="flex items-center justify-center space-x-2 mt-2">
              <selectedRoleData.icon className="h-4 w-4" />
              <span>{selectedRoleData.title}</span>
            </div>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">Contact Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="your.email@example.com"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              required
              disabled={loading}
            />
            <p className="text-xs text-muted-foreground">
              This email will be used for communication and verification purposes
            </p>
          </div>

          {requiresOrganization && (
            <div className="space-y-2">
              <Label htmlFor="organization">Organization Name</Label>
              <Input
                id="organization"
                placeholder="Your organization name"
                value={formData.organizationName}
                onChange={(e) => setFormData(prev => ({ ...prev, organizationName: e.target.value }))}
                required
                disabled={loading}
              />
            </div>
          )}

          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">Authentication Method</h4>
            <div className="flex items-center space-x-2 text-sm text-blue-700">
              <Shield className="h-4 w-4" />
              <span>Internet Identity (Blockchain)</span>
            </div>
            <p className="text-xs text-blue-600 mt-1">
              Your identity is secured by the Internet Computer blockchain
            </p>
          </div>

          <div className="flex space-x-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setStep("role")}
              disabled={loading}
              className="flex-1"
            >
              Back
            </Button>
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Registering...
                </>
              ) : (
                "Complete Registration"
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
