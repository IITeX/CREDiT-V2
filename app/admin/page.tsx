"use client"

import { useState } from "react"
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
} from "lucide-react"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { AdminGuard } from "@/components/auth/admin-guard"

// Mock data
const mockStats = {
  totalUsers: { value: 1247, change: 12, trend: "up" },
  pendingVerifications: { value: 23, change: -5, trend: "down" },
  totalCredentials: { value: 3891, change: 8, trend: "up" },
  activeCredentials: { value: 3654, change: 3, trend: "up" },
  organizations: { value: 156, change: 7, trend: "up" },
  verifiers: { value: 89, change: 2, trend: "up" },
}

const mockRecentUsers = [
  {
    id: 1,
    name: "Harvard University",
    email: "admin@harvard.edu",
    type: "Educational",
    status: "pending",
    joinDate: "2025-01-28",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 2,
    name: "Google Inc.",
    email: "hr@google.com",
    type: "Company",
    status: "verified",
    joinDate: "2025-01-27",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 3,
    name: "MIT",
    email: "registrar@mit.edu",
    type: "Educational",
    status: "pending",
    joinDate: "2025-01-26",
    avatar: "/placeholder.svg?height=40&width=40",
  },
]

const mockRecentCredentials = [
  {
    id: 1,
    title: "Computer Science Degree",
    issuer: "MIT",
    recipient: "john.doe@email.com",
    status: "pending",
    submittedDate: "2025-01-28",
  },
  {
    id: 2,
    title: "AWS Certification",
    issuer: "Amazon",
    recipient: "jane.smith@email.com",
    status: "verified",
    submittedDate: "2025-01-27",
  },
  {
    id: 3,
    title: "Data Science Certificate",
    issuer: "Stanford",
    recipient: "bob.wilson@email.com",
    status: "pending",
    submittedDate: "2025-01-26",
  },
]

export default function AdminDashboard() {
  const [timeRange, setTimeRange] = useState("7d")

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
    <AdminGuard>
      <div className="min-h-screen bg-green-gradient-subtle">
        <AdminSidebar />

        <div className="ml-80 p-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold gradient-text">Admin Dashboard</h1>
              <p className="text-gray-600 mt-2">Monitor and manage the dResume platform</p>
            </div>
            <div className="flex items-center space-x-4">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="border border-green-200 rounded-lg px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                <option value="24h">Last 24 hours</option>
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
              </select>
              <Button className="bg-green-600 text-white hover:bg-green-700 shadow-sm">
                <Activity className="mr-2 h-4 w-4" />
                Live View
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Admin Setup Alert */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <Card className="border-amber-200 bg-amber-50 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-amber-100 rounded-lg">
                    <AlertTriangle className="h-6 w-6 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-amber-900">Setup Required</h3>
                    <p className="text-sm text-amber-700">Complete the admin setup to enable all platform features</p>
                  </div>
                </div>
                <Button className="bg-amber-600 text-white hover:bg-amber-700">Setup Now</Button>
              </div>
            </CardContent>
          </Card>
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

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Organization Registrations */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Card className="card-clean">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-green-800">Recent Organization Registrations</CardTitle>
                    <CardDescription>Organizations awaiting verification</CardDescription>
                  </div>
                  <Button variant="outline" size="sm" className="border-green-200 text-green-700 hover:bg-green-50">
                    View All
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockRecentUsers.map((user) => (
                    <motion.div
                      key={user.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-green-50 hover:border-green-200 transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-10 w-10 border-2 border-green-200">
                          <AvatarImage src={user.avatar || "/placeholder.svg"} />
                          <AvatarFallback className="bg-green-100 text-green-700">
                            {user.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold text-gray-900">{user.name}</p>
                          <p className="text-sm text-gray-600">{user.email}</p>
                          <p className="text-xs text-gray-500">
                            {user.type} • {user.joinDate}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge
                          className={
                            user.status === "verified"
                              ? "bg-green-100 text-green-800 border-green-200"
                              : "bg-amber-100 text-amber-800 border-amber-200"
                          }
                        >
                          {user.status === "verified" ? (
                            <CheckCircle className="w-3 h-3 mr-1" />
                          ) : (
                            <Clock className="w-3 h-3 mr-1" />
                          )}
                          {user.status}
                        </Badge>
                        <Button variant="ghost" size="sm" className="text-gray-500 hover:text-green-600">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Recent Credential Requests */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <Card className="card-clean">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-green-800">Recent Credential Requests</CardTitle>
                    <CardDescription>Latest credentials submitted for review</CardDescription>
                  </div>
                  <Button variant="outline" size="sm" className="border-green-200 text-green-700 hover:bg-green-50">
                    View All
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockRecentCredentials.map((credential) => (
                    <motion.div
                      key={credential.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-green-50 hover:border-green-200 transition-colors"
                    >
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">{credential.title}</p>
                        <p className="text-sm text-gray-600">Issued by {credential.issuer}</p>
                        <p className="text-xs text-gray-500">
                          To: {credential.recipient} • {credential.submittedDate}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge
                          className={
                            credential.status === "verified"
                              ? "bg-green-100 text-green-800 border-green-200"
                              : "bg-amber-100 text-amber-800 border-amber-200"
                          }
                        >
                          {credential.status === "verified" ? (
                            <CheckCircle className="w-3 h-3 mr-1" />
                          ) : (
                            <Clock className="w-3 h-3 mr-1" />
                          )}
                          {credential.status}
                        </Badge>
                        <Button variant="ghost" size="sm" className="text-gray-500 hover:text-green-600">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

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
                  <div className="text-3xl font-bold text-blue-600 mb-2">4</div>
                  <p className="text-sm text-gray-600">ICP Canisters</p>
                  <Progress value={80} className="mt-2" />
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
    </AdminGuard>
  )
}
