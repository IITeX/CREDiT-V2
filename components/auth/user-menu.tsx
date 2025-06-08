"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useInternetIdentity } from "@/hooks/useInternetIdentity"
import { Copy, ExternalLink, LogOut, User, Shield, Check, RefreshCw, Wrench, Settings } from "lucide-react"

export function UserMenu() {
  const { principal, logout, isAuthenticated, loading, refresh, isDemoMode, getShortPrincipal } = useInternetIdentity()
  const [copied, setCopied] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)

  if (!isAuthenticated || !principal) {
    return null
  }

  const handleCopyPrincipal = async () => {
    if (principal) {
      try {
        await navigator.clipboard.writeText(principal.toString())
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      } catch (error) {
        console.error("❌ Failed to copy principal:", error)
      }
    }
  }

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.error("❌ Logout failed:", error)
    }
  }

  const handleRefresh = async () => {
    setIsRefreshing(true)
    try {
      await refresh()
    } catch (error) {
      console.error("❌ Refresh failed:", error)
    } finally {
      setIsRefreshing(false)
    }
  }

  const shortPrincipal = getShortPrincipal()
  const formattedPrincipal = principal?.toString() || ""
  const isDevLogin = isDemoMode

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar className="h-10 w-10">
            <AvatarImage src="/placeholder.svg?height=40&width=40" />
            <AvatarFallback className={`text-primary-foreground ${isDemoMode ? 'bg-orange-500' : 'bg-primary'}`}>
              {shortPrincipal.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          {isDemoMode && (
            <div className="absolute -top-1 -right-1">
              <Wrench className="h-3 w-3 text-orange-500" />
            </div>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-2">
            <div className="flex items-center space-x-2">
              <Shield className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium">
                {isDemoMode ? "Demo Login" : "Internet Identity"}
              </span>
              <Badge variant="outline" className={`text-xs ${isDemoMode ? 'bg-orange-50 text-orange-700 border-orange-200' : ''}`}>
                {isDemoMode ? "DEMO" : "Verified"}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <code className="text-xs text-muted-foreground font-mono">{formattedPrincipal}</code>
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={handleCopyPrincipal}>
                {copied ? <Check className="h-3 w-3 text-green-600" /> : <Copy className="h-3 w-3" />}
              </Button>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={handleRefresh} disabled={isRefreshing}>
          <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          <span>{isRefreshing ? "Refreshing..." : "Refresh Auth"}</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem>
          <User className="mr-2 h-4 w-4" />
          <span>Profile Settings</span>
        </DropdownMenuItem>

        <DropdownMenuItem>
          <Settings className="mr-2 h-4 w-4" />
          <span>Settings</span>
        </DropdownMenuItem>

        <DropdownMenuItem>
          <ExternalLink className="mr-2 h-4 w-4" />
          <span>View on IC Dashboard</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={handleLogout} disabled={loading} className="text-red-600">
          <LogOut className="mr-2 h-4 w-4" />
          <span>{loading ? "Logging out..." : "Log out"}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
