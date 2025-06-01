"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { User, Building, Shield, CheckCircle, Clock } from "lucide-react"

interface RoleSelectionProps {
  onRoleSelect: (role: string) => void
  onToggleMode: () => void
}

export function RoleSelection({ onRoleSelect, onToggleMode }: RoleSelectionProps) {
  const roles = [
    {
      id: "individual",
      title: "Individual",
      description: "Personal professional profile",
      icon: User,
      features: ["Create personal resume", "Add credentials & skills", "Share with employers", "Instant verification"],
      badge: "Most Popular",
      badgeColor: "bg-green-100 text-green-800",
      verification: "instant",
    },
    {
      id: "organization",
      title: "Organization",
      description: "Company or educational institution",
      icon: Building,
      features: [
        "Issue credentials to employees/students",
        "Verify work experience",
        "Manage organization profile",
        "Bulk credential issuance",
      ],
      badge: "Verification Required",
      badgeColor: "bg-yellow-100 text-yellow-800",
      verification: "manual",
    },
    {
      id: "verifier",
      title: "Verifier",
      description: "Third-party verification service",
      icon: Shield,
      features: [
        "Verify credentials for others",
        "Professional verification services",
        "API access for integrations",
        "Advanced verification tools",
      ],
      badge: "Enterprise",
      badgeColor: "bg-blue-100 text-blue-800",
      verification: "manual",
    },
  ]

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-green-800 mb-2">Choose Your Account Type</h1>
        <p className="text-green-600">Select the option that best describes your use case</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {roles.map((role) => {
          const IconComponent = role.icon
          return (
            <Card
              key={role.id}
              className="relative bg-white/90 backdrop-blur-lg border border-green-200 shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer group hover:scale-105"
              onClick={() => onRoleSelect(role.id)}
            >
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 group-hover:bg-green-200 transition-colors">
                  <IconComponent className="h-8 w-8 text-green-600" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-center gap-2">
                    <CardTitle className="text-xl font-bold text-green-800">{role.title}</CardTitle>
                    <Badge className={role.badgeColor}>{role.badge}</Badge>
                  </div>
                  <CardDescription className="text-green-600">{role.description}</CardDescription>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2">
                  {role.features.map((feature, index) => (
                    <li key={index} className="flex items-center text-sm text-gray-700">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <div className="pt-4 border-t border-green-100">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Verification:</span>
                    <div className="flex items-center">
                      {role.verification === "instant" ? (
                        <>
                          <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                          <span className="text-green-600 font-medium">Instant</span>
                        </>
                      ) : (
                        <>
                          <Clock className="h-4 w-4 text-yellow-500 mr-1" />
                          <span className="text-yellow-600 font-medium">24-48 hours</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <Button className="w-full bg-green-600 hover:bg-green-700 text-white group-hover:bg-green-700">
                  Select {role.title}
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="mt-8 text-center">
        <p className="text-sm text-green-600">
          Already have an account?{" "}
          <button onClick={onToggleMode} className="font-medium text-green-700 hover:text-green-800 underline">
            Sign in
          </button>
        </p>
      </div>
    </div>
  )
}
