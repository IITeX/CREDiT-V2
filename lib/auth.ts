import { AuthClient } from "@dfinity/auth-client"
import { HttpAgent } from "@dfinity/agent"
import { Principal } from "@dfinity/principal"
import type { Identity } from "@dfinity/agent"

// Types for authentication state
export interface AuthState {
  isAuthenticated: boolean
  principal: Principal | null
  identity: Identity | null
  authClient: AuthClient | null
}

// Enhanced authentication error types
export interface AuthError {
  type: 'NETWORK_ERROR' | 'IDENTITY_ERROR' | 'TIMEOUT_ERROR' | 'USER_CANCELLED' | 'UNKNOWN_ERROR'
  message: string
  details?: any
}

// Internet Identity provider URL with better environment detection
const getIdentityProviderUrl = (): string => {
  // Always use production Internet Identity for better compatibility
  // This ensures the app works in both development and production
  return "https://identity.ic0.app"
}

const II_URL = getIdentityProviderUrl()

// Auth client singleton with enhanced configuration
let authClient: AuthClient | null = null

export const getAuthClient = async (): Promise<AuthClient> => {
  if (!authClient) {
    const authTimeout = process.env.NEXT_PUBLIC_AUTH_TIMEOUT
      ? parseInt(process.env.NEXT_PUBLIC_AUTH_TIMEOUT)
      : 1000 * 60 * 30 // 30 minutes default

    authClient = await AuthClient.create({
      idleOptions: {
        idleTimeout: authTimeout,
        disableDefaultIdleCallback: true,
        disableIdle: false,
      },
      keyType: "Ed25519", // Explicitly set key type for better compatibility
    })
  }
  return authClient
}

// Enhanced login function with better error handling
export const login = async (): Promise<{ success: boolean; error?: AuthError }> => {
  try {
    const client = await getAuthClient()

    console.log("🔐 Starting Internet Identity login...")
    console.log("🌐 Identity Provider URL:", II_URL)
    console.log("🔧 Environment:", process.env.NODE_ENV)
    console.log("🔧 DFX Network:", process.env.NEXT_PUBLIC_DFX_NETWORK)
    console.log("🔧 Use Local II:", process.env.NEXT_PUBLIC_USE_LOCAL_II)

    // Use the official Internet Identity approach with Promise
    await new Promise<void>((resolve, reject) => {
      client.login({
        identityProvider: II_URL,
        maxTimeToLive: BigInt(7 * 24 * 60 * 60 * 1000 * 1000 * 1000), // 7 days in nanoseconds
        onSuccess: () => {
          console.log("✅ Internet Identity login successful")
          resolve()
        },
        onError: (error) => {
          console.error("❌ Internet Identity login failed:", error)
          reject(error)
        },
      })
    })

    return { success: true }
  } catch (error) {
    console.error("❌ Login error:", error)

    let authError: AuthError
    if (error?.toString?.()?.includes?.('UserInterrupt') || error?.toString?.()?.includes?.('cancelled')) {
      authError = {
        type: 'USER_CANCELLED',
        message: 'Login was cancelled by user',
        details: error
      }
    } else if (error?.toString?.()?.includes?.('network') || error?.toString?.()?.includes?.('fetch')) {
      authError = {
        type: 'NETWORK_ERROR',
        message: 'Network error during login - please check your connection',
        details: error
      }
    } else {
      authError = {
        type: 'UNKNOWN_ERROR',
        message: 'An unexpected error occurred during login',
        details: error
      }
    }

    return { success: false, error: authError }
  }
}

// Backward compatibility wrapper
export const loginLegacy = async (): Promise<boolean> => {
  const result = await login()
  return result.success
}

// Enhanced logout function
export const logout = async (): Promise<{ success: boolean; error?: AuthError }> => {
  try {
    const client = await getAuthClient()
    await client.logout()

    // Clear the auth client to force re-initialization
    authClient = null

    console.log("✅ Internet Identity logout successful")
    return { success: true }
  } catch (error) {
    console.error("❌ Logout error:", error)
    return {
      success: false,
      error: {
        type: 'UNKNOWN_ERROR',
        message: 'Failed to logout properly',
        details: error
      }
    }
  }
}

// Backward compatibility wrapper
export const logoutLegacy = async (): Promise<void> => {
  await logout()
}

// Enhanced auth state function with better error handling
export const getAuthState = async (): Promise<AuthState> => {
  try {
    const client = await getAuthClient()
    const isAuthenticated = await client.isAuthenticated()

    if (isAuthenticated) {
      const identity = client.getIdentity()
      const principal = identity.getPrincipal()

      // Validate that we have a proper principal
      if (!principal || principal.isAnonymous()) {
        console.warn("⚠️ Anonymous principal detected, treating as unauthenticated")
        return {
          isAuthenticated: false,
          principal: null,
          identity: null,
          authClient: client,
        }
      }

      console.log("✅ Authenticated with principal:", principal.toString())
      return {
        isAuthenticated: true,
        principal,
        identity,
        authClient: client,
      }
    }

    return {
      isAuthenticated: false,
      principal: null,
      identity: null,
      authClient: client,
    }
  } catch (error) {
    console.error("❌ Auth state error:", error)
    return {
      isAuthenticated: false,
      principal: null,
      identity: null,
      authClient: null,
    }
  }
}

// Check if user is authenticated (quick check)
export const isAuthenticated = async (): Promise<boolean> => {
  try {
    const client = await getAuthClient()
    return await client.isAuthenticated()
  } catch (error) {
    console.error("❌ Authentication check error:", error)
    return false
  }
}

// Get current principal (if authenticated)
export const getCurrentPrincipal = async (): Promise<Principal | null> => {
  try {
    const state = await getAuthState()
    return state.principal
  } catch (error) {
    console.error("❌ Error getting current principal:", error)
    return null
  }
}

// Enhanced agent creation with better configuration
export const createAgent = async (identity?: Identity): Promise<HttpAgent> => {
  const isDevelopment = process.env.NODE_ENV === "development" || process.env.NEXT_PUBLIC_DFX_NETWORK === "local"
  const host = isDevelopment
    ? (process.env.NEXT_PUBLIC_IC_HOST || "http://localhost:4943")
    : "https://ic0.app"

  const agent = new HttpAgent({
    host,
    identity,
    retryTimes: 3, // Add retry logic for better reliability
  })

  // Fetch root key for local development (only for local backend services)
  if (isDevelopment && host.includes('localhost')) {
    try {
      await agent.fetchRootKey()
      console.log("✅ Root key fetched for local development")
    } catch (error) {
      console.warn("⚠️ Could not fetch root key (local replica may not be running):", error)
      // Don't throw error - we can still use production Internet Identity
    }
  }

  return agent
}

// Create authenticated agent using current identity
export const createAuthenticatedAgent = async (): Promise<HttpAgent | null> => {
  try {
    const authState = await getAuthState()
    if (!authState.isAuthenticated || !authState.identity) {
      return null
    }

    return await createAgent(authState.identity)
  } catch (error) {
    console.error("❌ Failed to create authenticated agent:", error)
    return null
  }
}

// Utility function to format principal for display
export const formatPrincipal = (principal: Principal): string => {
  const principalText = principal.toString()
  if (principalText.length <= 20) return principalText
  return `${principalText.slice(0, 8)}...${principalText.slice(-8)}`
}

// Utility function to get short principal ID
export const getShortPrincipal = (principal: Principal): string => {
  return principal.toString().slice(0, 8)
}

// Utility function to validate principal format
export const isValidPrincipal = (principalText: string): boolean => {
  try {
    Principal.fromText(principalText)
    return true
  } catch {
    return false
  }
}

// Development helper functions
export const enableDevLogin = (principalText: string): boolean => {
  if (process.env.NEXT_PUBLIC_ENABLE_DEV_LOGIN !== 'true') {
    console.warn("⚠️ Dev login is not enabled")
    return false
  }

  if (!isValidPrincipal(principalText)) {
    console.error("❌ Invalid principal format for dev login")
    return false
  }

  localStorage.setItem('dev_principal', principalText)
  console.log("🔧 Dev login enabled for principal:", principalText)
  return true
}

export const disableDevLogin = (): void => {
  localStorage.removeItem('dev_principal')
  console.log("🔧 Dev login disabled")
}

export const getDevPrincipal = (): string | null => {
  // Check if we're in browser environment
  if (typeof window === 'undefined') {
    return null
  }

  // Check if dev login is enabled (be more flexible with the check)
  const enableDevLogin = process.env.NEXT_PUBLIC_ENABLE_DEV_LOGIN
  if (enableDevLogin !== 'true' && enableDevLogin !== true) {
    console.log("🔧 Dev login not enabled:", enableDevLogin)
    return null
  }

  const devPrincipal = localStorage.getItem('dev_principal')
  console.log("🔧 Getting dev principal:", devPrincipal)
  return devPrincipal
}
