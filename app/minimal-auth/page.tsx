"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { AuthClient } from "@dfinity/auth-client"
import { Principal } from "@dfinity/principal"

export default function MinimalAuthPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [principal, setPrincipal] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Check authentication status on load
  useEffect(() => {
    checkAuthStatus()
  }, [])

  const checkAuthStatus = async () => {
    try {
      console.log("🔍 Checking authentication status...")

      // Check dev login first
      const devPrincipal = localStorage.getItem('dev_principal')
      if (devPrincipal && process.env.NEXT_PUBLIC_ENABLE_DEV_LOGIN === 'true') {
        setIsAuthenticated(true)
        setPrincipal(devPrincipal)
        console.log("✅ Dev login active:", devPrincipal)
        return
      }

      // Check Internet Identity with more detailed logging
      console.log("🔍 Creating AuthClient for status check...")
      const authClient = await AuthClient.create({
        idleOptions: {
          disableIdle: true,
          disableDefaultIdleCallback: true,
        },
        // Use localStorage for better persistence
        storage: typeof window !== 'undefined' ? window.localStorage : undefined,
      })

      console.log("🔍 Checking if authenticated...")
      const authenticated = await authClient.isAuthenticated()
      console.log("🔍 Authentication result:", authenticated)

      if (authenticated) {
        console.log("🔍 Getting identity...")
        const identity = authClient.getIdentity()
        const userPrincipal = identity.getPrincipal()

        console.log("🔍 Principal details:")
        console.log("  - Principal:", userPrincipal.toString())
        console.log("  - Is anonymous:", userPrincipal.isAnonymous())

        if (!userPrincipal.isAnonymous()) {
          setIsAuthenticated(true)
          setPrincipal(userPrincipal.toString())
          console.log("✅ Internet Identity authenticated:", userPrincipal.toString())
        } else {
          console.log("⚠️ Anonymous principal, treating as unauthenticated")
          setIsAuthenticated(false)
          setPrincipal(null)
        }
      } else {
        console.log("❌ Not authenticated")
        setIsAuthenticated(false)
        setPrincipal(null)
      }
    } catch (err) {
      console.error("❌ Auth check error:", err)
      setError(String(err))
      setIsAuthenticated(false)
      setPrincipal(null)
    }
  }

  const handleDevLogin = () => {
    const dfxPrincipal = 'g5pqo-7ihb2-4vqek-pou4f-pauhm-tfylr-qcvnb-f5fnp-lfjs5-i7xtv-pae'
    localStorage.setItem('dev_principal', dfxPrincipal)
    setIsAuthenticated(true)
    setPrincipal(dfxPrincipal)
    console.log("✅ Dev login set with dfx principal:", dfxPrincipal)
  }

  const handleInternetIdentityLogin = async () => {
    setLoading(true)
    setError(null)

    try {
      console.log("🔐 Starting Internet Identity login with redirect...")

      // Create auth client with specific storage options
      const authClient = await AuthClient.create({
        idleOptions: {
          disableIdle: true,
          disableDefaultIdleCallback: true,
        },
        // Use localStorage for better persistence
        storage: typeof window !== 'undefined' ? window.localStorage : undefined,
      })

      console.log("✅ AuthClient created with localStorage")

      // Use redirect instead of popup for better reliability
      const currentUrl = window.location.href
      const redirectUrl = currentUrl // Redirect back to same page

      console.log("🚀 Starting login with redirect to:", redirectUrl)

      await authClient.login({
        identityProvider: "https://identity.ic0.app",
        maxTimeToLive: BigInt(7 * 24 * 60 * 60 * 1000 * 1000 * 1000), // 7 days
        // Use redirect instead of popup
        windowOpenerFeatures: undefined, // This forces redirect mode
        onSuccess: () => {
          console.log("✅ Login redirect completed!")
          // The page will reload after redirect, so this might not execute
        },
        onError: (error) => {
          console.error("❌ Login redirect failed:", error)
          setError(String(error))
          setLoading(false)
        },
      })

    } catch (err) {
      console.error("❌ Login error:", err)
      setError(String(err))
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      // Clear dev login
      localStorage.removeItem('dev_principal')
      
      // Logout from Internet Identity
      const authClient = await AuthClient.create()
      await authClient.logout()
      
      setIsAuthenticated(false)
      setPrincipal(null)
      console.log("✅ Logged out")
    } catch (err) {
      console.error("❌ Logout error:", err)
      setError(String(err))
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold">Minimal Authentication Test</h1>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Authentication Status</h2>
          <div className="space-y-2">
            <p><strong>Authenticated:</strong> {isAuthenticated ? "Yes" : "No"}</p>
            <p><strong>Principal:</strong> {principal || "None"}</p>
            <p><strong>Loading:</strong> {loading ? "Yes" : "No"}</p>
            {error && <p className="text-red-600"><strong>Error:</strong> {error}</p>}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Actions</h2>
          <div className="space-y-2">
            <Button onClick={handleDevLogin} variant="outline" className="w-full">
              🔧 Dev Login
            </Button>

            <Button
              onClick={() => {
                // Test popup permissions
                const popup = window.open("https://identity.ic0.app", "_blank", "width=525,height=525")
                if (popup) {
                  console.log("✅ Popup opened successfully")
                  setTimeout(() => popup.close(), 3000)
                } else {
                  console.error("❌ Popup blocked")
                  setError("Popup blocked - please allow popups for this site")
                }
              }}
              variant="outline"
              className="w-full"
            >
              🧪 Test Popup
            </Button>

            <Button
              onClick={handleInternetIdentityLogin}
              disabled={loading}
              className="w-full"
            >
              {loading ? "Connecting..." : "🌐 Internet Identity (Redirect)"}
            </Button>

            <Button
              onClick={async () => {
                setLoading(true)
                setError(null)

                try {
                  console.log("🔐 Trying popup with better storage...")

                  const authClient = await AuthClient.create({
                    idleOptions: {
                      disableIdle: true,
                      disableDefaultIdleCallback: true,
                    },
                    storage: typeof window !== 'undefined' ? window.localStorage : undefined,
                  })

                  await new Promise<void>((resolve, reject) => {
                    authClient.login({
                      identityProvider: "https://identity.ic0.app",
                      maxTimeToLive: BigInt(7 * 24 * 60 * 60 * 1000 * 1000 * 1000),
                      windowOpenerFeatures: "width=525,height=525,left=100,top=100,toolbar=0,location=0,menubar=0,resizable=1,scrollbars=1",
                      onSuccess: async () => {
                        console.log("✅ Popup login success!")

                        // Wait a bit for storage to sync
                        setTimeout(async () => {
                          await checkAuthStatus()
                          resolve()
                        }, 1000)
                      },
                      onError: (error) => {
                        console.error("❌ Popup login failed:", error)
                        reject(error)
                      },
                    })
                  })
                } catch (err) {
                  console.error("❌ Popup login error:", err)
                  setError(String(err))
                } finally {
                  setLoading(false)
                }
              }}
              disabled={loading}
              variant="outline"
              className="w-full"
            >
              {loading ? "Connecting..." : "🪟 Internet Identity (Popup)"}
            </Button>

            <Button onClick={handleLogout} variant="destructive" className="w-full">
              🚪 Logout
            </Button>

            <Button onClick={checkAuthStatus} variant="secondary" className="w-full">
              🔄 Refresh Status
            </Button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
            <h3 className="font-semibold text-red-800 mb-2">Troubleshooting Tips:</h3>
            <ul className="text-sm text-red-700 space-y-1">
              <li>• Make sure popups are allowed for localhost:3000</li>
              <li>• Try disabling browser extensions temporarily</li>
              <li>• Use Chrome or Firefox for best compatibility</li>
              <li>• Check browser console for detailed error messages</li>
            </ul>
          </div>
        )}

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Environment</h2>
          <div className="text-sm space-y-1">
            <p><strong>NODE_ENV:</strong> {process.env.NODE_ENV}</p>
            <p><strong>ENABLE_DEV_LOGIN:</strong> {process.env.NEXT_PUBLIC_ENABLE_DEV_LOGIN}</p>
            <p><strong>DFX_NETWORK:</strong> {process.env.NEXT_PUBLIC_DFX_NETWORK}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
