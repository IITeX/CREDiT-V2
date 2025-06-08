"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import {
  Users,
  FileCheck,
  Clock,
  CheckCircle,
  Eye,
  MoreHorizontal,
  ArrowUp,
  ArrowDown,
  Activity,
  Building,
  UserCheck,
  AlertTriangle,
  LogOut,
  XCircle,
} from "lucide-react"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { useRouter } from "next/navigation"

// Mock admin user
const mockAdmin = {
  id: "admin-001",
  name: "System Administrator",
  email: "admin@credit.app",
  role: "Super Admin",
  avatar: "/admin-avatar.png",
  lastLogin: "2025-01-28T10:00:00Z",
  permissions: ["user_management", "system_config", "analytics", "verification"]
}

// Mock real-time data
const mockStats = {
  totalUsers: { value: 1247, change: 12, trend: "up" },
  pendingVerifications: { value: 23, change: -5, trend: "down" },
  totalCredentials: { value: 3891, change: 8, trend: "up" },
  activeCredentials: { value: 3654, change: 3, trend: "up" },
  organizations: { value: 156, change: 7, trend: "up" },
  verifiers: { value: 89, change: 2, trend: "up" },
}

const mockPendingUsers = [
  {
    id: 1,
    name: "Harvard University",
    email: "admin@harvard.edu",
    type: "Educational",
    status: "pending",
    joinDate: "2025-01-28",
    documents: ["accreditation.pdf", "license.pdf"],
    principal: "rdmx6-jaaaa-aaaah-qcaaa-cai",
  },
  {
    id: 2,
    name: "Google Inc.",
    email: "hr@google.com",
    type: "Company",
    status: "pending",
    joinDate: "2025-01-27",
    documents: ["business_license.pdf", "tax_cert.pdf"],
    principal: "rrkah-fqaaa-aaaah-qcaaq-cai",
  },
  {
    id: 3,
    name: "MIT",
    email: "registrar@mit.edu",
    type: "Educational",
    status: "pending",
    joinDate: "2025-01-26",
    documents: ["accreditation.pdf", "charter.pdf"],
    principal: "ryjl3-tyaaa-aaaah-qcaaw-cai",
  },
]

export default function AdminDirectDashboard() {
  const router = useRouter()
  const [timeRange, setTimeRange] = useState("7d")
  const [pendingUsers, setPendingUsers] = useState(mockPendingUsers)
  const [isProcessing, setIsProcessing] = useState<number | null>(null)

  const handleVerifyUser = async (userId: number, approve: boolean) => {
    setIsProcessing(userId)
    try {
      // Simulate API call to canister
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      setPendingUsers(prev => 
        prev.map(user => 
          user.id === userId 
            ? { ...user, status: approve ? "verified" : "rejected" }
            : user
        )
      )
      
      // Remove from pending list after verification
      setTimeout(() => {
        setPendingUsers(prev => prev.filter(user => user.id !== userId))
      }, 1000)
      
    } catch (error) {
      console.error('Error verifying user:', error)
    } finally {
      setIsProcessing(null)
    }
  }

  const handleLogout = () => {
    router.push('/')
  }

  const StatCard = ({ title, value, change, trend, icon: Icon, color = "green" }: any) => (
    <Card className="card-clean hover:shadow-md transition-shadow duration-200">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-3xl font-bold text-gray-900">{value.toLocaleString()}</p>
            <div className="flex items-center mt-2">
              {trend === "up" ? (
                <ArrowUp className="h-4 w-4 text-green-600 mr-1" />
              ) : (
                <ArrowDown className="h-4 w-4 text-red-600 mr-1" />
              )}
              <span className={`text-sm ${trend === "up" ? "text-green-600" : "text-red-600"}`}>
                {change}% from last week
              </span>
            </div>
          </div>
          <div className={`p-3 rounded-full ${color === "green" ? "bg-green-100" : "bg-blue-100"}`}>
            <Icon className={`h-6 w-6 ${color === "green" ? "text-green-600" : "text-blue-600"}`} />
          </div>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="min-h-screen bg-green-gradient-subtle">
      <AdminSidebar />

      <div className="ml-80 p-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold gradient-text">Admin Dashboard</h1>
              <p className="text-gray-600 mt-2">Monitor and manage the CREDiT platform</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-green-100 text-green-700">
                    {mockAdmin.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium">{mockAdmin.name}</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="flex items-center gap-2"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 mb-8"
        >
          <StatCard
            title="Total Users"
            value={mockStats.totalUsers.value}
            change={mockStats.totalUsers.change}
            trend={mockStats.totalUsers.trend}
            icon={Users}
          />
          <StatCard
            title="Organizations"
            value={mockStats.organizations.value}
            change={mockStats.organizations.change}
            trend={mockStats.organizations.trend}
            icon={Building}
          />
          <StatCard
            title="Verifiers"
            value={mockStats.verifiers.value}
            change={mockStats.verifiers.change}
            trend={mockStats.verifiers.trend}
            icon={UserCheck}
          />
          <StatCard
            title="Pending Reviews"
            value={mockStats.pendingVerifications.value}
            change={mockStats.pendingVerifications.change}
            trend={mockStats.pendingVerifications.trend}
            icon={Clock}
            color="blue"
          />
          <StatCard
            title="Total Credentials"
            value={mockStats.totalCredentials.value}
            change={mockStats.totalCredentials.change}
            trend={mockStats.totalCredentials.trend}
            icon={FileCheck}
          />
          <StatCard
            title="Active Credentials"
            value={mockStats.activeCredentials.value}
            change={mockStats.activeCredentials.change}
            trend={mockStats.activeCredentials.trend}
            icon={CheckCircle}
          />
        </motion.div>

        {/* Pending Verifications */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card className="card-clean">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-green-800">Pending User Verifications</CardTitle>
                  <CardDescription>Organizations awaiting admin approval</CardDescription>
                </div>
                <Badge variant="secondary" className="bg-amber-100 text-amber-800">
                  {pendingUsers.length} Pending
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pendingUsers.map((user) => (
                  <motion.div
                    key={user.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-green-50 hover:border-green-200 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-10 w-10 border-2 border-green-200">
                        <AvatarFallback className="bg-green-100 text-green-700">
                          {user.name.split(" ").map((n) => n[0]).join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold text-gray-900">{user.name}</p>
                        <p className="text-sm text-gray-600">{user.email}</p>
                        <p className="text-xs text-gray-500">
                          {user.type} • {user.joinDate} • {user.documents.length} documents
                        </p>
                        <p className="text-xs text-gray-400 font-mono">
                          Principal: {user.principal}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {user.status === "verified" ? (
                        <Badge className="bg-green-100 text-green-800 border-green-200">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Verified
                        </Badge>
                      ) : user.status === "rejected" ? (
                        <Badge className="bg-red-100 text-red-800 border-red-200">
                          <XCircle className="w-3 h-3 mr-1" />
                          Rejected
                        </Badge>
                      ) : (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleVerifyUser(user.id, false)}
                            disabled={isProcessing === user.id}
                            className="text-red-600 border-red-200 hover:bg-red-50"
                          >
                            <XCircle className="h-4 w-4 mr-1" />
                            Reject
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleVerifyUser(user.id, true)}
                            disabled={isProcessing === user.id}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            {isProcessing === user.id ? (
                              <Activity className="h-4 w-4 mr-1 animate-spin" />
                            ) : (
                              <CheckCircle className="h-4 w-4 mr-1" />
                            )}
                            {isProcessing === user.id ? "Processing..." : "Approve"}
                          </Button>
                        </>
                      )}
                    </div>
                  </motion.div>
                ))}
                
                {pendingUsers.length === 0 && (
                  <div className="text-center py-8">
                    <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
                    <p className="text-gray-600">No pending verifications</p>
                    <p className="text-sm text-gray-500">All users have been processed</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* System Health */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8"
        >
          <Card className="card-clean">
            <CardHeader>
              <CardTitle className="text-green-800">System Health & Performance</CardTitle>
              <CardDescription>Real-time platform status and metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">Online</div>
                  <p className="text-sm text-gray-600">Platform Status</p>
                  <Progress value={100} className="mt-2" />
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">2</div>
                  <p className="text-sm text-gray-600">ICP Canisters</p>
                  <Progress value={100} className="mt-2" />
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600 mb-2">99.9%</div>
                  <p className="text-sm text-gray-600">Uptime</p>
                  <Progress value={99.9} className="mt-2" />
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-emerald-600 mb-2">Fast</div>
                  <p className="text-sm text-gray-600">Response Time</p>
                  <Progress value={95} className="mt-2" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
