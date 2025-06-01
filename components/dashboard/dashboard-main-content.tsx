"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { useAuth } from "@/contexts/auth-context"
import { formatPrincipal } from "@/lib/auth"
import {
  Shield,
  CheckCircle,
  Clock,
  AlertCircle,
  Award,
  Users,
  Eye,
  Plus,
  ExternalLink,
  Calendar,
  Briefcase,
  GraduationCap,
  Trophy,
  FileCheck,
} from "lucide-react"

interface DashboardMainContentProps {
  user?: any
  credentials?: any[]
  isUserVerified: boolean
  isUserPending: boolean
  isLoading: boolean
  onCreateCredential?: () => void
}

// Mock credentials for demo
const mockCredentials = [
  {
    id: 1,
    type: "certificate",
    title: "AWS Solutions Architect",
    issuer: "Amazon Web Services",
    date: "2024-01-15",
    status: "verified",
    verifier: "AWS Training",
    description: "Professional certification for cloud architecture",
    icon: Award,
    tokenId: "CS-2024-001",
  },
  {
    id: 2,
    type: "work",
    title: "Senior Frontend Developer",
    issuer: "TechCorp Inc.",
    date: "2023-06-01",
    status: "verified",
    verifier: "HR Manager - Sarah Johnson",
    description: "Led frontend development team for 18 months",
    icon: Briefcase,
    tokenId: "WE-2023-045",
  },
]

export function DashboardMainContent({
  user,
  credentials,
  isUserVerified,
  isUserPending,
  isLoading,
  onCreateCredential,
}: DashboardMainContentProps) {
  const { principal } = useAuth()
  
  // Use backend data if available, otherwise fall back to mock data
  const displayCredentials = credentials && credentials.length > 0 ? credentials : mockCredentials

  const getStatusColor = (status: string) => {
    switch (status) {
      case "verified":
        return "bg-green-100 text-green-800 border-green-200"
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "self-verified":
        return "bg-blue-100 text-blue-800 border-blue-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  return (
    <div className="w-full space-y-4 lg:space-y-6">
      {/* Welcome Header */}
      <div className="space-y-2">
        <h1 className="text-2xl lg:text-3xl font-bold">
          Welcome back, {user?.email ? user.email.split('@')[0] : "John"}!
        </h1>
        <p className="text-gray-600 text-sm lg:text-base">
          Manage your verified credentials and professional profile
        </p>
      </div>

      {/* Verification Status Card */}
      {!isUserVerified && (
        <Card className={`${isUserPending ? 'border-yellow-200 bg-yellow-50' : 'border-blue-200 bg-blue-50'}`}>
          <CardHeader>
            <CardTitle className={`flex items-center ${isUserPending ? 'text-yellow-800' : 'text-blue-800'}`}>
              <Clock className="h-5 w-5 mr-2" />
              {isUserPending ? 'Verification Pending' : 'Account Verification Required'}
            </CardTitle>
            <CardDescription className={isUserPending ? 'text-yellow-700' : 'text-blue-700'}>
              {isUserPending
                ? 'Your account is under review. Our verification system is processing your submitted documents.'
                : 'You\'ll be able to create and manage credentials once your account is verified.'
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isUserPending ? (
              <div className="space-y-3">
                <div className="flex items-center text-sm text-yellow-700">
                  <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                  Documents uploaded
                </div>
                <div className="flex items-center text-sm text-yellow-700">
                  <Clock className="h-4 w-4 mr-2" />
                  AI verification in progress
                </div>
                <div className="flex items-center text-sm text-yellow-600">
                  <Clock className="h-4 w-4 mr-2" />
                  Manual review (if needed)
                </div>
                <p className="text-xs text-yellow-600 mt-4">
                  This typically takes 24-48 hours. You'll receive an email notification once approved.
                </p>
              </div>
            ) : (
              <div className="text-center py-8">
                <Clock className="h-16 w-16 text-blue-400 mx-auto mb-4" />
                <p className="text-blue-700 mb-4">
                  Account Verification Required
                </p>
                <p className="text-sm text-blue-600">
                  You'll be able to create and manage credentials once your account is verified.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Verified Account Success */}
      {isUserVerified && (
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="text-green-800 flex items-center">
              <CheckCircle className="h-5 w-5 mr-2" />
              Verified Account
            </CardTitle>
            <CardDescription className="text-green-700">
              You can now issue credential tokens and manage your professional profile
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={onCreateCredential} className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Create New Credential
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Stats Grid */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Credentials</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{displayCredentials.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Verified</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {displayCredentials.filter((c: any) => c.status === "verified" || !c.isRevoked).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {displayCredentials.filter((c: any) => c.status === "pending").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Profile Views</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,234</div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Credentials */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center">
                <Award className="h-5 w-5 mr-2" />
                My Credentials
              </CardTitle>
              <CardDescription>
                Your verified professional credentials and achievements
              </CardDescription>
            </div>
            <Button variant="outline" size="sm">
              <Eye className="h-4 w-4 mr-2" />
              View All
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {displayCredentials.slice(0, 3).map((credential: any) => {
            const IconComponent = credential.icon || Award
            return (
              <Card key={credential.id} className="border-l-4 border-l-primary">
                <CardContent className="p-4">
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between space-y-3 lg:space-y-0">
                    <div className="flex items-start space-x-3 flex-1">
                      <div className="p-2 bg-primary/10 rounded-lg flex-shrink-0">
                        <IconComponent className="h-5 w-5 text-primary" />
                      </div>
                      <div className="space-y-1 min-w-0 flex-1">
                        <h4 className="font-semibold text-sm lg:text-base truncate">{credential.title}</h4>
                        <p className="text-sm text-gray-600 truncate">{credential.issuer}</p>
                        <div className="flex flex-wrap items-center gap-2">
                          <Badge variant="outline" className={`${getStatusColor(credential.status)} text-xs`}>
                            {credential.status}
                          </Badge>
                          {credential.tokenId && (
                            <Badge variant="outline" className="text-xs">
                              ID: {credential.tokenId}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 lg:flex-shrink-0">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                        <span className="sr-only lg:not-sr-only lg:ml-1">View</span>
                      </Button>
                      <Button variant="ghost" size="sm">
                        <ExternalLink className="h-4 w-4" />
                        <span className="sr-only lg:not-sr-only lg:ml-1">Share</span>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
          
          {displayCredentials.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Award className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No credentials yet</p>
              <p className="text-sm">Create your first credential to get started</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
