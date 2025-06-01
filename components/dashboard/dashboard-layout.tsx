"use client"

import { ReactNode, useState } from "react"
import { Button } from "@/components/ui/button"
import { DashboardSidebar } from "./dashboard-sidebar"
import { Menu, X } from "lucide-react"

interface DashboardLayoutProps {
  children: ReactNode
  user?: any
  isUserVerified: boolean
  isUserPending: boolean
  onCreateCredential?: () => void
}

export function DashboardLayout({
  children,
  user,
  isUserVerified,
  isUserPending,
  onCreateCredential
}: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="relative">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed left-0 top-0 z-40 w-72 lg:w-80 h-screen bg-white border-r border-gray-200 flex flex-col transform transition-transform duration-300 ease-in-out ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0`}>
        <DashboardSidebar
          user={user}
          isUserVerified={isUserVerified}
          isUserPending={isUserPending}
          onCreateCredential={onCreateCredential}
          onClose={() => setSidebarOpen(false)}
        />
      </div>

      {/* Main content */}
      <div className="lg:ml-80">
        {/* Mobile header */}
        <div className="lg:hidden flex items-center justify-between p-4 border-b border-gray-200 bg-white">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden"
          >
            <Menu className="h-6 w-6" />
          </Button>
          <h1 className="text-lg font-semibold">Dashboard</h1>
          <div className="w-10" /> {/* Spacer for centering */}
        </div>

        {/* Main content area */}
        <main className="min-h-screen bg-gray-50">
          <div className="p-4 lg:p-6 lg:px-10">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
