"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState, type ReactNode, useCallback } from "react"
import {
  getAuthState,
  login as authLogin,
  logout as authLogout,
  loginLegacy,
  logoutLegacy,
  type AuthState,
  type AuthError,
  getDevPrincipal,
  isValidPrincipal
} from "@/lib/auth"
import { Principal } from "@dfinity/principal"

interface AuthContextType extends AuthState {
  login: () => Promise<boolean>
  logout: () => Promise<void>
  loading: boolean
  error: AuthError | null
  clearError: () => void
  refreshAuth: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    principal: null,
    identity: null,
    authClient: null,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<AuthError | null>(null)

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  const updateAuthState = useCallback(async () => {
    try {
      setError(null)
      console.log("🔄 Updating auth state...")

      // Check for dev login first (if enabled)
      const devPrincipal = getDevPrincipal()
      console.log("🔧 Dev principal check:", devPrincipal)

      if (devPrincipal && isValidPrincipal(devPrincipal)) {
        try {
          const principal = Principal.fromText(devPrincipal)
          setAuthState({
            isAuthenticated: true,
            principal,
            identity: null, // Dev login doesn't have real identity
            authClient: null,
          })
          console.log("🔧 Dev login active for principal:", devPrincipal)
          return
        } catch (err) {
          console.error("❌ Invalid dev principal, removing:", err)
          localStorage.removeItem('dev_principal')
        }
      } else {
        console.log("🔧 No valid dev principal found")
      }

      // Regular Internet Identity authentication
      const state = await getAuthState()
      setAuthState(state)

      if (state.isAuthenticated && state.principal) {
        console.log("✅ Authentication state updated - Principal:", state.principal.toString())
      }
    } catch (error) {
      console.error("❌ Failed to update auth state:", error)
      setError({
        type: 'UNKNOWN_ERROR',
        message: 'Failed to check authentication status',
        details: error
      })
    } finally {
      setLoading(false)
    }
  }, [])

  const refreshAuth = useCallback(async () => {
    setLoading(true)
    await updateAuthState()
  }, [updateAuthState])

  const login = useCallback(async (): Promise<boolean> => {
    setLoading(true)
    setError(null)

    try {
      const result = await authLogin()

      if (result.success) {
        await updateAuthState()
        return true
      } else {
        if (result.error) {
          setError(result.error)
        }
        return false
      }
    } catch (error) {
      console.error("❌ Login failed:", error)
      setError({
        type: 'UNKNOWN_ERROR',
        message: 'An unexpected error occurred during login',
        details: error
      })
      return false
    } finally {
      setLoading(false)
    }
  }, [updateAuthState])

  const logout = useCallback(async (): Promise<void> => {
    setLoading(true)
    setError(null)

    try {
      // Clear dev login if active
      const devPrincipal = getDevPrincipal()
      if (devPrincipal) {
        localStorage.removeItem('dev_principal')
        console.log("🔧 Dev login cleared")
      }

      const result = await authLogout()

      // Always clear the auth state, even if logout had issues
      setAuthState({
        isAuthenticated: false,
        principal: null,
        identity: null,
        authClient: null,
      })

      if (!result.success && result.error) {
        setError(result.error)
      }

      console.log("✅ Logout completed")
    } catch (error) {
      console.error("❌ Logout failed:", error)
      setError({
        type: 'UNKNOWN_ERROR',
        message: 'An error occurred during logout',
        details: error
      })

      // Still clear auth state even if there was an error
      setAuthState({
        isAuthenticated: false,
        principal: null,
        identity: null,
        authClient: null,
      })
    } finally {
      setLoading(false)
    }
  }, [])

  // Initialize auth state on mount
  useEffect(() => {
    updateAuthState()
  }, [updateAuthState])

  // Auto-refresh auth state periodically (every 5 minutes)
  useEffect(() => {
    const interval = setInterval(() => {
      if (!loading) {
        updateAuthState()
      }
    }, 5 * 60 * 1000) // 5 minutes

    return () => clearInterval(interval)
  }, [loading, updateAuthState])

  const value: AuthContextType = {
    ...authState,
    login,
    logout,
    loading,
    error,
    clearError,
    refreshAuth,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
