"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  LayoutDashboard,
  Users,
  FileCheck,
  Settings,
  BarChart3,
  Shield,
  Bell,
  HelpCircle,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Building,
  UserCheck,
  Database,
  Globe,
} from "lucide-react"

const navigation = [
  {
    name: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
    description: "Overview and analytics",
  },
  {
    name: "User Management",
    href: "/admin/users",
    icon: Users,
    description: "Manage user accounts",
  },
  {
    name: "Organizations",
    href: "/admin/organizations",
    icon: Building,
    description: "Verify organizations",
  },
  {
    name: "Credentials",
    href: "/admin/credentials",
    icon: FileCheck,
    description: "Review credentials",
  },
  {
    name: "Verifiers",
    href: "/admin/verifiers",
    icon: UserCheck,
    description: "Manage verifiers",
  },
  {
    name: "Analytics",
    href: "/admin/analytics",
    icon: BarChart3,
    description: "Platform insights",
  },
  {
    name: "System Health",
    href: "/admin/system",
    icon: Database,
    description: "Monitor system status",
  },
  {
    name: "Global Settings",
    href: "/admin/settings",
    icon: Settings,
    description: "Platform configuration",
  },
]

const bottomNavigation = [
  {
    name: "Notifications",
    href: "/admin/notifications",
    icon: Bell,
    badge: 3,
  },
  {
    name: "Security",
    href: "/admin/security",
    icon: Shield,
  },
  {
    name: "Help & Support",
    href: "/admin/help",
    icon: HelpCircle,
  },
]

export function AdminSidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const pathname = usePathname()

  return (
    <motion.div
      initial={{ x: -280 }}
      animate={{ x: 0, width: collapsed ? 80 : 280 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="fixed left-0 top-0 z-50 h-screen bg-white border-r border-green-200 shadow-sm"
    >
      <div className="flex h-full flex-col">
        {/* Header */}
        <div className="flex h-16 items-center justify-between px-4 border-b border-green-200">
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center space-x-2"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-600">
                <Globe className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-green-800">dResume</h1>
                <p className="text-xs text-green-600">Admin Panel</p>
              </div>
            </motion.div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCollapsed(!collapsed)}
            className="h-8 w-8 p-0 text-green-600 hover:bg-green-50"
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>

        {/* Admin Profile */}
        <div className="p-4 border-b border-green-200">
          <div className="flex items-center space-x-3">
            <Avatar className="h-10 w-10 border-2 border-green-200">
              <AvatarImage src="/placeholder.svg?height=40&width=40" />
              <AvatarFallback className="bg-green-100 text-green-700">AD</AvatarFallback>
            </Avatar>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 min-w-0"
              >
                <p className="text-sm font-medium text-gray-900 truncate">Admin User</p>
                <p className="text-xs text-green-600 truncate">admin@dresume.com</p>
              </motion.div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 p-4 overflow-y-auto">
          <div className="space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link key={item.name} href={item.href}>
                  <motion.div
                    whileHover={{ x: 2 }}
                    className={cn(
                      "group flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-green-100 text-green-800 border border-green-200"
                        : "text-gray-700 hover:bg-green-50 hover:text-green-800",
                    )}
                  >
                    <item.icon
                      className={cn(
                        "mr-3 h-5 w-5 flex-shrink-0",
                        isActive ? "text-green-600" : "text-gray-500 group-hover:text-green-600",
                      )}
                    />
                    {!collapsed && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex-1"
                      >
                        <div className="flex items-center justify-between">
                          <span>{item.name}</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-0.5">{item.description}</p>
                      </motion.div>
                    )}
                  </motion.div>
                </Link>
              )
            })}
          </div>

          {/* Divider */}
          <div className="my-4 border-t border-green-200" />

          {/* Bottom Navigation */}
          <div className="space-y-1">
            {bottomNavigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link key={item.name} href={item.href}>
                  <motion.div
                    whileHover={{ x: 2 }}
                    className={cn(
                      "group flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-green-100 text-green-800 border border-green-200"
                        : "text-gray-700 hover:bg-green-50 hover:text-green-800",
                    )}
                  >
                    <item.icon
                      className={cn(
                        "mr-3 h-5 w-5 flex-shrink-0",
                        isActive ? "text-green-600" : "text-gray-500 group-hover:text-green-600",
                      )}
                    />
                    {!collapsed && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center justify-between flex-1"
                      >
                        <span>{item.name}</span>
                        {item.badge && (
                          <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-500 rounded-full">
                            {item.badge}
                          </span>
                        )}
                      </motion.div>
                    )}
                  </motion.div>
                </Link>
              )
            })}
          </div>
        </nav>

        {/* Sign Out */}
        <div className="p-4 border-t border-green-200">
          <Button variant="ghost" className="w-full justify-start text-gray-700 hover:bg-red-50 hover:text-red-700">
            <LogOut className="mr-3 h-5 w-5" />
            {!collapsed && <span>Sign Out</span>}
          </Button>
        </div>
      </div>
    </motion.div>
  )
}
