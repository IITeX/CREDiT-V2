"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Shield,
  Plus,
  ExternalLink,
  Calendar,
  CheckCircle,
  Clock,
  Award,
  Briefcase,
  GraduationCap,
  Heart,
  Code,
  Trophy,
  Users,
  Loader2,
  RefreshCw,
} from "lucide-react"
import { AddCredentialDialog } from "@/components/add-credential-dialog"
import { AuthGuard } from "@/components/auth/auth-guard"
import { UserMenu } from "@/components/auth/user-menu"
import { ICErrorBoundary } from "@/components/error/ic-error-boundary"
import { CredentialLoadingState, ProfileLoadingState } from "@/components/error/ic-loading-state"
import { NetworkStatus } from "@/components/error/network-status"
import { ICIntegrationTester } from "@/components/testing/ic-integration-tester"
import { useAuth } from "@/contexts/auth-context"
import { formatPrincipal } from "@/lib/auth"
import { useUserManagement, useCredentials } from "@/hooks/useIC"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { DashboardMainContent } from "@/components/dashboard/dashboard-main-content"

// Mock data for demonstration
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
  },
  {
    id: 3,
    type: "education",
    title: "Bachelor of Computer Science",
    issuer: "State University",
    date: "2022-05-20",
    status: "verified",
    verifier: "University Registrar",
    description: "Graduated Magna Cum Laude, GPA: 3.8",
    icon: GraduationCap,
  },
  {
    id: 4,
    type: "volunteer",
    title: "Coding Mentor",
    issuer: "Code for Good NGO",
    date: "2023-09-10",
    status: "pending",
    verifier: "Program Coordinator",
    description: "Mentored 15+ students in web development",
    icon: Heart,
  },
  {
    id: 5,
    type: "project",
    title: "E-commerce Platform",
    issuer: "Personal Project",
    date: "2024-02-28",
    status: "self-verified",
    verifier: "Self-verified",
    description: "Full-stack e-commerce platform with 1000+ users",
    icon: Code,
  },
  {
    id: 6,
    type: "hackathon",
    title: "Best Innovation Award",
    issuer: "TechHack 2024",
    date: "2024-03-15",
    status: "verified",
    verifier: "Event Organizers",
    description: "1st place in sustainability category",
    icon: Trophy,
  },
]

export default function DashboardPage() {
  return (
    <AuthGuard requireRegistration={false}>
      <ICErrorBoundary>
        <NetworkStatus />
        <DashboardContent />
      </ICErrorBoundary>
    </AuthGuard>
  )
}

function DashboardContent() {
  const { principal } = useAuth()
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)

  // ICP hooks
  const { user, getMyProfile, loading: userLoading } = useUserManagement()
  const { credentials, getMyCredentials, loading: credentialsLoading } = useCredentials()

  // Load user data and credentials on mount
  useEffect(() => {
    if (principal) {
      getMyProfile().catch(console.error)
      getMyCredentials().catch(console.error)
    }
  }, [principal, getMyProfile, getMyCredentials])

  // Check if user is verified (check for 'Approved' status from backend)
  const isUserVerified = user?.verificationStatus &&
    (Object.keys(user.verificationStatus)[0] === 'Approved' ||
     Object.keys(user.verificationStatus)[0] === 'verified' ||
     Object.keys(user.verificationStatus)[0] === 'Verified')

  // Check if user is pending verification
  const isUserPending = user?.verificationStatus &&
    (Object.keys(user.verificationStatus)[0] === 'Pending' ||
     Object.keys(user.verificationStatus)[0] === 'pending' ||
     Object.keys(user.verificationStatus)[0] === 'UnderReview')

  // Use backend data if available, otherwise fall back to mock data
  const displayCredentials = credentials && credentials.length > 0 ? credentials : mockCredentials
  const isLoading = userLoading || credentialsLoading

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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "verified":
        return <CheckCircle className="h-3 w-3" />
      case "pending":
        return <Clock className="h-3 w-3" />
      case "self-verified":
        return <Shield className="h-3 w-3" />
      default:
        return null
    }
  }

  const filterCredentialsByType = (type: string) => {
    if (type === "all") return displayCredentials
    return displayCredentials.filter((cred: any) => {
      // Map backend credential types to frontend types
      if (cred.credentialType) {
        const backendType = Object.keys(cred.credentialType)[0]?.toLowerCase()
        return backendType === type
      }
      return cred.type === type
    })
  }
  
  const refreshData = async () => {
    if (principal) {
      await Promise.all([
        getMyProfile().catch(console.error),
        getMyCredentials().catch(console.error)
      ])
    }
  }

  return (
    <DashboardLayout
      user={user}
      isUserVerified={isUserVerified}
      isUserPending={isUserPending}
      onCreateCredential={() => setIsAddDialogOpen(true)}
    >
      <DashboardMainContent
        user={user}
        credentials={credentials}
        isUserVerified={isUserVerified}
        isUserPending={isUserPending}
        isLoading={isLoading}
        onCreateCredential={() => setIsAddDialogOpen(true)}
      />

      {/* Development Testing Component */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-8">
          <h2 className="text-lg font-semibold mb-4">Development Tools</h2>
          <ICIntegrationTester />
        </div>
      )}

      <AddCredentialDialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen} />
    </DashboardLayout>
  )
}
