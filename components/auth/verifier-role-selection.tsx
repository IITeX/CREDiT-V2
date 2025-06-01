"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, GraduationCap, Building, FileCheck, Heart, Globe } from "lucide-react"

interface VerifierRoleSelectionProps {
  onBack: () => void
  onRoleSelect: (role: string) => void
  onContinueAsIndividual: () => void
}

export function VerifierRoleSelection({ onBack, onRoleSelect, onContinueAsIndividual }: VerifierRoleSelectionProps) {
  const roles = [
    {
      id: "educational",
      title: "Educational Institution",
      description: "Universities, colleges, schools, training centers",
      icon: GraduationCap,
      color: "bg-blue-100 text-blue-800",
    },
    {
      id: "company",
      title: "Company/Employer",
      description: "Businesses, startups, corporations",
      icon: Building,
      color: "bg-green-100 text-green-800",
    },
    {
      id: "certification",
      title: "Certification Body",
      description: "Professional certification authorities",
      icon: FileCheck,
      color: "bg-purple-100 text-purple-800",
    },
    {
      id: "ngo",
      title: "NGO/Organization",
      description: "Non-profits, community organizations",
      icon: Heart,
      color: "bg-pink-100 text-pink-800",
    },
    {
      id: "platform",
      title: "Platform/Marketplace",
      description: "Upwork, Fiverr, GitHub, etc.",
      icon: Globe,
      color: "bg-orange-100 text-orange-800",
    },
  ]

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="icon" onClick={onBack} className="mr-2">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Choose Your Verifier Role</h1>
          <p className="text-gray-600">Select the type of organization you represent to issue verified credentials</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-8">
        {roles.map((role) => {
          const IconComponent = role.icon
          return (
            <Card
              key={role.id}
              className="cursor-pointer hover:shadow-lg transition-all duration-200 border-2 hover:border-green-300"
              onClick={() => onRoleSelect(role.id)}
            >
              <CardHeader className="text-center pb-2">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                  <IconComponent className="h-6 w-6 text-gray-600" />
                </div>
                <CardTitle className="text-lg font-semibold">{role.title}</CardTitle>
                <CardDescription className="text-sm">{role.description}</CardDescription>
              </CardHeader>
              <CardContent className="pt-0 text-center">
                <Badge variant="secondary" className="text-xs">
                  Strict Verification Required
                </Badge>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="text-center">
        <p className="text-gray-600 mb-4">Looking to create a personal resume?</p>
        <Button
          variant="outline"
          onClick={onContinueAsIndividual}
          className="border-green-300 text-green-700 hover:bg-green-50"
        >
          Continue as Individual User
        </Button>
      </div>
    </div>
  )
}
