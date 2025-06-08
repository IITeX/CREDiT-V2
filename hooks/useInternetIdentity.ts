"use client"

import { useState, useEffect, useCallback } from 'react'
import { AuthClient } from '@dfinity/auth-client'
import { Identity } from '@dfinity/agent'
import { Principal } from '@dfinity/principal'
import { createActor, canisterId } from '@/src/declarations/credential_nft'
import { getCanisterIds } from '@/lib/config'

// Get the correct Internet Identity URL based on environment
const getIdentityProvider = (): string => {
  const network = process.env.NEXT_PUBLIC_DFX_NETWORK
  console.log('🌐 Network environment:', network)

  // Since you're using deployed canisters, always use production Internet Identity
  const identityProvider = 'https://identity.ic0.app'
  console.log('🌐 Using identity provider:', identityProvider)

  return identityProvider
}

// Demo login configuration
const getDemoPrincipal = (): string | null => {
  if (typeof window === 'undefined') return null
  
  const enableDemo = process.env.NEXT_PUBLIC_ENABLE_DEMO_LOGIN === 'true'
  if (!enableDemo) return null
  
  return localStorage.getItem('demo_principal') || process.env.NEXT_PUBLIC_DEMO_PRINCIPAL || null
}

const setDemoPrincipal = (principal: string | null): void => {
  if (typeof window === 'undefined') return
  
  if (principal) {
    localStorage.setItem('demo_principal', principal)
  } else {
    localStorage.removeItem('demo_principal')
  }
}

export interface AuthState {
  isAuthenticated: boolean
  principal: Principal | null
  identity: Identity | null
  authClient: AuthClient | null
  actor: any | null
  isDemoMode: boolean
}

export const useInternetIdentity = () => {
  const [state, setState] = useState<AuthState>({
    isAuthenticated: false,
    principal: null,
    identity: null,
    authClient: null,
    actor: null,
    isDemoMode: false
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Initialize auth client and check authentication status
  const updateActor = useCallback(async () => {
    try {
      setError(null)
      console.log('🔄 Updating Internet Identity actor...')
      
      // Check for demo login first
      const demoPrincipal = getDemoPrincipal()
      if (demoPrincipal) {
        try {
          const principal = Principal.fromText(demoPrincipal)
          console.log('🎭 Demo mode active with principal:', demoPrincipal)
          
          setState({
            isAuthenticated: true,
            principal,
            identity: null, // Demo mode doesn't have real identity
            authClient: null,
            actor: null, // Demo mode uses mock data
            isDemoMode: true
          })
          return
        } catch (err) {
          console.error('❌ Invalid demo principal, clearing:', err)
          setDemoPrincipal(null)
        }
      }

      // Create AuthClient following official documentation pattern
      console.log('🔧 Creating AuthClient...')
      const authClient = await AuthClient.create({
        idleOptions: {
          idleTimeout: 1000 * 60 * 30, // 30 minutes
          disableDefaultIdleCallback: true,
        },
      })
      console.log('✅ AuthClient created successfully')
      console.log('🔍 AuthClient methods available:', Object.getOwnPropertyNames(Object.getPrototypeOf(authClient)))

      const isAuthenticated = await authClient.isAuthenticated()
      
      if (isAuthenticated) {
        const identity = authClient.getIdentity()
        const principal = identity.getPrincipal()
        
        // Validate that we have a proper principal (not anonymous)
        if (principal.isAnonymous()) {
          console.warn('⚠️ Anonymous principal detected, treating as unauthenticated')
          setState({
            isAuthenticated: false,
            principal: null,
            identity: null,
            authClient,
            actor: null,
            isDemoMode: false
          })
          return
        }

        // Create actor with authenticated identity using deployed canisters
        const deployedCanisterId = canisterId || getCanisterIds().credentialNft
        console.log('🔧 Using canister ID:', deployedCanisterId)

        const actor = createActor(deployedCanisterId, {
          agentOptions: {
            identity,
            host: 'https://ic0.app' // Always use IC mainnet since canisters are deployed
          }
        })

        console.log('✅ Created actor for deployed credential_nft canister:', deployedCanisterId)

        console.log('✅ Authenticated with principal:', principal.toString())
        setState({
          isAuthenticated: true,
          principal,
          identity,
          authClient,
          actor,
          isDemoMode: false
        })
      } else {
        setState({
          isAuthenticated: false,
          principal: null,
          identity: null,
          authClient,
          actor: null,
          isDemoMode: false
        })
      }
    } catch (error) {
      console.error('❌ Failed to update actor:', error)
      setError(error instanceof Error ? error.message : 'Failed to initialize authentication')
      setState({
        isAuthenticated: false,
        principal: null,
        identity: null,
        authClient: null,
        actor: null,
        isDemoMode: false
      })
    } finally {
      setLoading(false)
    }
  }, [])

  // Login function following official documentation
  const login = useCallback(async (): Promise<boolean> => {
    try {
      setLoading(true)
      setError(null)

      console.log('🔐 Starting Internet Identity login...')

      // For localhost development, suggest using demo login instead
      if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        console.warn('⚠️ Internet Identity may not work properly on localhost')
        console.log('💡 Consider using demo login for local development')

        // Still try Internet Identity but with better error handling
        if (!state.authClient) {
          console.log('🔄 AuthClient not initialized, creating new one...')
          const authClient = await AuthClient.create({
            idleOptions: {
              idleTimeout: 1000 * 60 * 30, // 30 minutes
              disableDefaultIdleCallback: true,
            },
          })

          setState(prev => ({ ...prev, authClient }))
          return await performLogin(authClient)
        }

        return await performLogin(state.authClient)
      }

      // For production domains
      if (!state.authClient) {
        console.log('🔄 AuthClient not initialized, creating new one...')
        const authClient = await AuthClient.create({
          idleOptions: {
            idleTimeout: 1000 * 60 * 30, // 30 minutes
            disableDefaultIdleCallback: true,
          },
        })

        setState(prev => ({ ...prev, authClient }))
        return await performLogin(authClient)
      }

      return await performLogin(state.authClient)
    } catch (error) {
      console.error('❌ Login error:', error)
      const errorMessage = error instanceof Error ? error.message : 'Login failed'

      // Provide helpful error messages for common issues
      if (errorMessage.includes('popup') || errorMessage.includes('blocked')) {
        setError('Popup blocked. Please allow popups for this site and try again, or use demo login.')
      } else if (window.location.hostname === 'localhost') {
        setError('Internet Identity may not work on localhost. Try demo login or deploy to a proper domain.')
      } else {
        setError(errorMessage)
      }

      return false
    } finally {
      setLoading(false)
    }
  }, [state.authClient, updateActor])

  // Helper function to perform the actual login
  const performLogin = async (authClient: AuthClient): Promise<boolean> => {
    const identityProvider = getIdentityProvider()
    console.log('🌐 Using identity provider:', identityProvider)
    console.log('🌐 Current hostname:', window.location.hostname)
    console.log('🌐 Current origin:', window.location.origin)

    // Check if popups are allowed
    console.log('🔍 Testing popup permissions...')
    try {
      const testPopup = window.open('', '_blank', 'width=1,height=1')
      if (!testPopup) {
        console.error('❌ Popup blocked!')
        throw new Error('Popup blocked. Please allow popups for this site and try again.')
      }
      testPopup.close()
      console.log('✅ Popup permissions OK')
    } catch (popupError) {
      console.error('❌ Popup test failed:', popupError)
      throw new Error('Popup test failed. Please check your browser settings.')
    }

    // Use Promise-based approach as shown in official docs
    console.log('🔐 Starting login process...')

    try {
      await new Promise<void>((resolve, reject) => {
        const timeoutId = setTimeout(() => {
          console.error('❌ Login timeout after 60 seconds')
          reject(new Error('Login timeout. The Internet Identity popup may have been closed or blocked.'))
        }, 60000) // 60 second timeout

        console.log('🔐 Calling authClient.login with options:', {
          identityProvider,
          maxTimeToLive: '7 days',
          windowOpenerFeatures: 'toolbar=0,location=0,menubar=0,width=500,height=500,left=100,top=100'
        })

        authClient.login({
          identityProvider,
          maxTimeToLive: BigInt(7 * 24 * 60 * 60 * 1000 * 1000 * 1000), // 7 days
          windowOpenerFeatures: 'toolbar=0,location=0,menubar=0,width=500,height=500,left=100,top=100',
          onSuccess: () => {
            clearTimeout(timeoutId)
            console.log('✅ Internet Identity login successful - onSuccess callback triggered')
            resolve()
          },
          onError: (error) => {
            clearTimeout(timeoutId)
            console.error('❌ Internet Identity login failed - onError callback triggered:', error)

            // Provide more specific error messages
            let errorMessage = 'Internet Identity login failed'
            if (typeof error === 'string') {
              if (error.includes('UserInterrupt')) {
                errorMessage = 'Login was cancelled by user'
              } else if (error.includes('popup')) {
                errorMessage = 'Popup was blocked or closed'
              } else {
                errorMessage = error
              }
            }

            reject(new Error(errorMessage))
          }
        })
        console.log('🔐 authClient.login called, waiting for callback...')
      })
    } catch (loginError) {
      console.error('❌ Login process failed:', loginError)
      throw loginError
    }

    console.log('🔄 Login promise resolved, updating actor...')
    // Update actor after successful login
    await updateActor()
    console.log('✅ Actor updated successfully')
    return true
  }

  // Demo login function
  const loginDemo = useCallback(async (principal?: string): Promise<boolean> => {
    try {
      setLoading(true)
      setError(null)
      
      const demoPrincipal = principal || process.env.NEXT_PUBLIC_DEMO_PRINCIPAL
      if (!demoPrincipal) {
        throw new Error('No demo principal configured')
      }

      console.log('🎭 Starting demo login with principal:', demoPrincipal)
      
      // Validate principal format
      Principal.fromText(demoPrincipal)
      
      // Set demo principal
      setDemoPrincipal(demoPrincipal)
      
      // Update state
      await updateActor()
      return true
    } catch (error) {
      console.error('❌ Demo login error:', error)
      setError(error instanceof Error ? error.message : 'Demo login failed')
      return false
    } finally {
      setLoading(false)
    }
  }, [updateActor])

  // Logout function
  const logout = useCallback(async (): Promise<void> => {
    try {
      setLoading(true)
      setError(null)
      
      // Clear demo login if active
      if (state.isDemoMode) {
        setDemoPrincipal(null)
        console.log('🎭 Demo login cleared')
      }
      
      // Logout from Internet Identity if authenticated
      if (state.authClient && state.isAuthenticated && !state.isDemoMode) {
        await state.authClient.logout()
        console.log('✅ Internet Identity logout successful')
      }

      // Reset state
      setState({
        isAuthenticated: false,
        principal: null,
        identity: null,
        authClient: state.authClient, // Keep authClient for future logins
        actor: null,
        isDemoMode: false
      })
    } catch (error) {
      console.error('❌ Logout error:', error)
      setError(error instanceof Error ? error.message : 'Logout failed')
    } finally {
      setLoading(false)
    }
  }, [state.authClient, state.isAuthenticated, state.isDemoMode])

  // Get principal as string for display
  const getPrincipalText = useCallback((): string => {
    if (!state.principal) return ''
    return state.principal.toString()
  }, [state.principal])

  // Get short principal for display
  const getShortPrincipal = useCallback((): string => {
    const principalText = getPrincipalText()
    if (principalText.length <= 16) return principalText
    return `${principalText.slice(0, 8)}...${principalText.slice(-8)}`
  }, [getPrincipalText])

  // Initialize on mount
  useEffect(() => {
    updateActor()
  }, [updateActor])

  return {
    // State
    ...state,
    loading,
    error,
    
    // Actions
    login,
    loginDemo,
    logout,
    refresh: updateActor,
    
    // Utilities
    getPrincipalText,
    getShortPrincipal,
    clearError: () => setError(null),
    
    // Demo utilities
    isDemoAvailable: process.env.NEXT_PUBLIC_ENABLE_DEMO_LOGIN === 'true',
    demoPrincipal: process.env.NEXT_PUBLIC_DEMO_PRINCIPAL || null
  }
}
