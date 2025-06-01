"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { AdminGuard } from "@/components/auth/admin-guard"
import { useUserManagement } from "@/hooks/useIC"
import {
  Users,
  Search,
  Filter,
  CheckCircle,
  Clock,
  XCircle,
  MoreHorizontal,
  Eye,
  UserCheck,
  UserX,
  Mail,
  Calendar,
} from "lucide-react"

export default function AdminUsersPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [roleFilter, setRoleFilter] = useState("all")
  
  // ICP hooks
  const { getAllUsers, updateVerificationStatus, loading } = useUserManagement()
  const [users, setUsers] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Load users on mount
  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = async () => {
    setIsLoading(true)
    try {
      const result = await getAllUsers()
      if (result) {
        setUsers(result)
      }
    } catch (error) {
      console.error('Failed to load users:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleStatusUpdate = async (userId: string, status: 'Approved' | 'Rejected') => {
    try {
      const statusObj = { [status]: null }
      await updateVerificationStatus(userId, statusObj)
      // Reload users to get updated data
      await loadUsers()
    } catch (error) {
      console.error('Failed to update user status:', error)
    }
  }

  const getStatusInfo = (status: any) => {
    if (!status) return { label: "Unknown", color: "bg-gray-100 text-gray-800", icon: XCircle }
    
    const statusKey = Object.keys(status)[0]
    switch (statusKey) {
      case 'Approved':
        return { label: "Approved", color: "bg-green-100 text-green-800", icon: CheckCircle }
      case 'Pending':
        return { label: "Pending", color: "bg-yellow-100 text-yellow-800", icon: Clock }
      case 'Rejected':
        return { label: "Rejected", color: "bg-red-100 text-red-800", icon: XCircle }
      default:
        return { label: statusKey, color: "bg-gray-100 text-gray-800", icon: Clock }
    }
  }

  const getRoleInfo = (role: any) => {
    if (!role) return "Unknown"
    return Object.keys(role)[0] || "Unknown"
  }

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (user.organizationName && user.organizationName.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesStatus = statusFilter === "all" || 
                         (user.verificationStatus && Object.keys(user.verificationStatus)[0].toLowerCase() === statusFilter.toLowerCase())
    
    const matchesRole = roleFilter === "all" || 
                       (user.role && Object.keys(user.role)[0].toLowerCase() === roleFilter.toLowerCase())
    
    return matchesSearch && matchesStatus && matchesRole
  })

  return (
    <AdminGuard>
      <div className="min-h-screen bg-green-gradient-subtle">
        <AdminSidebar />

        <div className="ml-80 p-8">
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold gradient-text">User Management</h1>
                <p className="text-gray-600 mt-2">Manage user accounts and verification status</p>
              </div>
              <div className="flex items-center space-x-4">
                <Button onClick={loadUsers} disabled={isLoading} className="bg-green-600 text-white hover:bg-green-700">
                  <Users className="mr-2 h-4 w-4" />
                  {isLoading ? "Loading..." : "Refresh"}
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-6"
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        placeholder="Search by email or organization..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={roleFilter} onValueChange={setRoleFilter}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Filter by role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Roles</SelectItem>
                      <SelectItem value="individual">Individual</SelectItem>
                      <SelectItem value="company">Company</SelectItem>
                      <SelectItem value="educational">Educational</SelectItem>
                      <SelectItem value="ngo">NGO</SelectItem>
                      <SelectItem value="certificationbody">Certification Body</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Users List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  Users ({filteredUsers.length})
                </CardTitle>
                <CardDescription>
                  Manage user accounts and verification status
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
                    <p className="mt-2 text-gray-600">Loading users...</p>
                  </div>
                ) : filteredUsers.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>No users found</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredUsers.map((user) => {
                      const statusInfo = getStatusInfo(user.verificationStatus)
                      const StatusIcon = statusInfo.icon
                      const role = getRoleInfo(user.role)
                      
                      return (
                        <motion.div
                          key={user.id.toString()}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-green-50 hover:border-green-200 transition-colors"
                        >
                          <div className="flex items-center space-x-4">
                            <Avatar className="h-12 w-12 border-2 border-green-200">
                              <AvatarImage src="/placeholder.svg" />
                              <AvatarFallback className="bg-green-100 text-green-700">
                                {user.email.substring(0, 2).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-semibold text-gray-900">{user.email}</p>
                              {user.organizationName && (
                                <p className="text-sm text-gray-600">{user.organizationName}</p>
                              )}
                              <div className="flex items-center space-x-4 text-xs text-gray-500 mt-1">
                                <span>Role: {role}</span>
                                <span>•</span>
                                <span>ID: {user.id.toString().substring(0, 8)}...</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-3">
                            <Badge className={statusInfo.color}>
                              <StatusIcon className="w-3 h-3 mr-1" />
                              {statusInfo.label}
                            </Badge>
                            {statusInfo.label === "Pending" && (
                              <div className="flex space-x-2">
                                <Button
                                  size="sm"
                                  onClick={() => handleStatusUpdate(user.id.toString(), 'Approved')}
                                  className="bg-green-600 hover:bg-green-700 text-white"
                                >
                                  <UserCheck className="h-4 w-4 mr-1" />
                                  Approve
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleStatusUpdate(user.id.toString(), 'Rejected')}
                                  className="border-red-200 text-red-700 hover:bg-red-50"
                                >
                                  <UserX className="h-4 w-4 mr-1" />
                                  Reject
                                </Button>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </AdminGuard>
  )
}
