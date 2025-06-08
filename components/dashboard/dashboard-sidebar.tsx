"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { useAuth } from "@/contexts/auth-context"
import { useUserManagement } from "@/hooks/useIC"
import { formatPrincipal } from "@/lib/auth"
import {
  User,
  Shield,
  FileText,
  Settings,
  BarChart3,
  Clock,
  CheckCircle,
  AlertCircle,
  Plus,
  Eye,
  Award,
  Users,
  X,
} from "lucide-react"

interface DashboardSidebarProps {
  user?: any
  isUserVerified: boolean
  isUserPending: boolean
  onCreateCredential?: () => void
  onClose?: () => void
  isIssuer?: boolean
}

const individualNavigation = [
  {
    name: "Profile",
    href: "/dashboard",
    icon: User,
    description: "Your profile overview",
  },
  {
    name: "My Credentials",
    href: "/dashboard/credentials",
    icon: Award,
    description: "Manage your credentials",
  },
  {
    name: "Public Profile",
    href: "/profile/demo",
    icon: Eye,
    description: "View your public profile",
    external: true,
  },
  {
    name: "Analytics",
    href: "/dashboard/analytics",
    icon: BarChart3,
    description: "Profile views and stats",
  },
  {
    name: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
    description: "Account settings",
  },
]

const issuerNavigation = [
  {
    name: "Dashboard",
    href: "/issuer-dashboard",
    icon: User,
    description: "Issuer overview",
  },
  {
    name: "Token Management",
    href: "/issuer-dashboard/tokens",
    icon: Award,
    description: "Manage generated tokens",
  },
  {
    name: "Certificate Builder",
    href: "/certificate-builder",
    icon: FileText,
    description: "Create certificates",
    external: true,
  },
  {
    name: "Recipients",
    href: "/issuer-dashboard/recipients",
    icon: Users,
    description: "Credential recipients",
  },
  {
    name: "Analytics",
    href: "/issuer-dashboard/analytics",
    icon: BarChart3,
    description: "Issuance analytics",
  },
  {
    name: "Settings",
    href: "/issuer-dashboard/settings",
    icon: Settings,
    description: "Issuer settings",
  },
]

export function DashboardSidebar({
  user,
  isUserVerified,
  isUserPending,
  onCreateCredential,
  onClose,
  isIssuer = false
}: DashboardSidebarProps) {
  const pathname = usePathname()
  const { principal } = useAuth()

  const getVerificationStatusInfo = () => {
    if (isUserVerified) {
      return {
        status: "Verified",
        color: "bg-green-100 text-green-800 border-green-200",
        icon: CheckCircle,
        iconColor: "text-green-600"
      }
    } else if (isUserPending) {
      return {
        status: "Pending Review",
        color: "bg-yellow-100 text-yellow-800 border-yellow-200",
        icon: Clock,
        iconColor: "text-yellow-600"
      }
    } else {
      return {
        status: "Unverified",
        color: "bg-gray-100 text-gray-800 border-gray-200",
        icon: AlertCircle,
        iconColor: "text-gray-600"
      }
    }
  }

  const statusInfo = getVerificationStatusInfo()
  const StatusIcon = statusInfo.icon
  const navigation = isIssuer ? issuerNavigation : individualNavigation

  return (
    <div className="w-full h-full flex flex-col">
      {/* Mobile close button */}
      <div className="lg:hidden flex justify-end p-4">
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="h-6 w-6" />
        </Button>
      </div>

      {/* Profile Section */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3 mb-4">
          <Avatar className="h-12 w-12">
            <AvatarImage src="/placeholder.svg?height=48&width=48" />
            <AvatarFallback>
              {user?.email ? user.email.substring(0, 2).toUpperCase() : "JD"}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-semibold truncate">
              {user?.email || "John Doe"}
            </h2>
            <p className="text-sm text-gray-600 truncate">
              {user?.role ? Object.keys(user.role)[0] : "Individual"}
            </p>
          </div>
        </div>

        {/* Verification Status */}
        <Badge variant="outline" className={`w-full justify-center ${statusInfo.color} mb-3`}>
          <StatusIcon className={`h-3 w-3 mr-1 ${statusInfo.iconColor}`} />
          {statusInfo.status}
        </Badge>

        {/* ICP Identity */}
        <div className="text-xs text-gray-500 text-center">
          <div className="flex items-center justify-center">
            <Shield className="h-3 w-3 mr-1" />
            ICP: {principal ? formatPrincipal(principal) : "Loading..."}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {navigation.map((item) => {
          const IconComponent = item.icon
          const isActive = pathname === item.href
          
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => onClose?.()}
              className={cn(
                "flex items-center space-x-3 px-3 py-2 rounded-lg text-sm transition-colors",
                isActive
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-gray-700 hover:bg-gray-100"
              )}
              {...(item.external && { target: "_blank", rel: "noopener noreferrer" })}
            >
              <IconComponent className="h-4 w-4" />
              <div className="flex-1">
                <div>{item.name}</div>
                <div className="text-xs text-gray-500">{item.description}</div>
              </div>
            </Link>
          )
        })}
      </nav>

      {/* Action Section */}
      <div className="p-4 border-t border-gray-200">
        {isUserVerified ? (
          <Button 
            onClick={onCreateCredential} 
            className="w-full"
            size="sm"
          >
            <Plus className="h-4 w-4 mr-2" />
            {isIssuer ? 'Generate Tokens' : 'Create Credential'}
          </Button>
        ) : (
          <Card className="border-blue-200 bg-blue-50">
            <CardContent className="p-3">
              <div className="text-center">
                <Clock className="h-8 w-8 text-blue-400 mx-auto mb-2" />
                <p className="text-xs text-blue-700">
                  {isUserPending
                    ? `Account under review. You'll be able to ${isIssuer ? 'generate tokens' : 'create credentials'} once verified.`
                    : `Complete verification to ${isIssuer ? 'generate tokens' : 'create credentials'}.`
                  }
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
