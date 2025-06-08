"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
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
import { UserMenu } from "@/components/auth/user-menu"
import { ICErrorBoundary } from "@/components/error/ic-error-boundary"
import { NetworkStatus } from "@/components/error/network-status"
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
]

export default function DashboardDirectPage() {
  return (
    <ICErrorBoundary>
      <NetworkStatus />
      <DashboardContentDirect />
    </ICErrorBoundary>
  )
}

function DashboardContentDirect() {
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

  // Mock user data for admin
  const mockUser = {
    email: "admin@CREDiT.app",
    role: { Company: null },
    organizationName: "CREDiT Admin",
    verificationStatus: { Approved: null }
  }

  // Use mock data or real data
  const displayUser = user || mockUser
  const displayCredentials = credentials && credentials.length > 0 ? credentials : mockCredentials

  // Check if user is verified (check for 'Approved' status from backend)
  const isUserVerified = displayUser?.verificationStatus &&
    (Object.keys(displayUser.verificationStatus)[0] === 'Approved' ||
     Object.keys(displayUser.verificationStatus)[0] === 'verified' ||
     Object.keys(displayUser.verificationStatus)[0] === 'Verified')

  // Check if user is pending verification
  const isUserPending = displayUser?.verificationStatus &&
    (Object.keys(displayUser.verificationStatus)[0] === 'Pending' ||
     Object.keys(displayUser.verificationStatus)[0] === 'pending' ||
     Object.keys(displayUser.verificationStatus)[0] === 'UnderReview')

  const isLoading = userLoading || credentialsLoading

  return (
    <DashboardLayout
      user={displayUser}
      isUserVerified={isUserVerified || true} // Default to verified for admin
      isUserPending={isUserPending || false}
      onCreateCredential={() => setIsAddDialogOpen(true)}
    >
      <div className="space-y-6">
        {/* Development Notice */}
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-blue-600" />
              <div>
                <p className="font-medium text-blue-800">Development Mode - Direct Dashboard Access</p>
                <p className="text-sm text-blue-700">
                  This is a direct access to the dashboard bypassing authentication checks.
                  Use this to test the new layout while we fix the backend integration.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <DashboardMainContent
          user={displayUser}
          credentials={displayCredentials}
          isUserVerified={isUserVerified || true}
          isUserPending={isUserPending || false}
          isLoading={isLoading}
          onCreateCredential={() => setIsAddDialogOpen(true)}
        />
        
        {/* Quick Links */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Test different parts of the application</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button asChild variant="outline" className="h-auto p-4">
                <Link href="/dashboard" className="flex flex-col items-center space-y-2">
                  <Shield className="h-6 w-6" />
                  <div className="text-center">
                    <div className="font-medium">Regular Dashboard</div>
                    <div className="text-xs text-muted-foreground">With auth guard</div>
                  </div>
                </Link>
              </Button>
              
              <Button asChild variant="outline" className="h-auto p-4">
                <Link href="/admin" className="flex flex-col items-center space-y-2">
                  <Users className="h-6 w-6" />
                  <div className="text-center">
                    <div className="font-medium">Admin Panel</div>
                    <div className="text-xs text-muted-foreground">User management</div>
                  </div>
                </Link>
              </Button>
              
              <Button asChild variant="outline" className="h-auto p-4">
                <Link href="/setup-admin" className="flex flex-col items-center space-y-2">
                  <Award className="h-6 w-6" />
                  <div className="text-center">
                    <div className="font-medium">Admin Setup</div>
                    <div className="text-xs text-muted-foreground">Register as admin</div>
                  </div>
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <AddCredentialDialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen} />
    </DashboardLayout>
  )
}
