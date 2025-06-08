"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { useUserManagement } from "./useIC"
import { mockVerifiedIssuers, type MockIssuer } from "@/lib/mock-data"

export interface Issuer {
  id: string
  email: string
  organizationName?: string
  role: string
  verificationStatus: string
  tokenPrefix?: string
  description?: string
  website?: string
  logoUrl?: string
}

export function useIssuers() {
  const [issuers, setIssuers] = useState<Issuer[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { principal } = useAuth()

  const fetchIssuers = async () => {
    if (!principal) return

    setLoading(true)
    setError(null)

    try {
      // TODO: Implement actual API call to fetch verified issuers from deployed canisters
      // For now, return comprehensive mock data
      const issuers: Issuer[] = mockVerifiedIssuers.map((issuer: MockIssuer) => ({
        id: issuer.id,
        email: issuer.email,
        organizationName: issuer.organizationName,
        role: issuer.role,
        verificationStatus: issuer.verificationStatus,
        tokenPrefix: issuer.tokenPrefix,
        description: issuer.description,
        website: issuer.website,
        logoUrl: issuer.logoUrl
      }))

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800))

      setIssuers(issuers)
    } catch (err) {
      console.error("Error fetching issuers:", err)
      setError(err instanceof Error ? err.message : "Failed to fetch issuers")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchIssuers()
  }, [principal])

  return {
    issuers,
    loading,
    error,
    refetch: fetchIssuers
  }
}
