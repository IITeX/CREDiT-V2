"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { 
  ArrowLeft, 
  Shield, 
  Calendar, 
  User, 
  Building, 
  Award, 
  ExternalLink,
  CheckCircle,
  Clock,
  Hash,
  Loader2
} from "lucide-react"
import { useCredentials } from "@/hooks/useIC"

export default function CredentialDetailPage() {
  const params = useParams()
  const tokenId = params.tokenId as string
  const [credential, setCredential] = useState<any>(null)
  const [nft, setNFT] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const { getCredentialByToken, getNFT } = useCredentials()

  useEffect(() => {
    const fetchCredential = async () => {
      if (!tokenId) return

      setLoading(true)
      setError("")

      try {
        // Fetch credential by token ID
        const credentialData = await getCredentialByToken(tokenId)
        
        if (credentialData) {
          setCredential(credentialData)
          
          // Also fetch NFT data
          const nftData = await getNFT(tokenId)
          if (nftData) {
            setNFT(nftData)
          }
        } else {
          setError("Credential not found. Please check the token ID and try again.")
        }
      } catch (err) {
        console.error('Error fetching credential:', err)
        setError("Error loading credential. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    fetchCredential()
  }, [tokenId, getCredentialByToken, getNFT])

  const formatDate = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) / 1000000) // Convert nanoseconds to milliseconds
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getCredentialTypeDisplay = (credentialType: any) => {
    if (credentialType.Certification) return "Certification"
    if (credentialType.WorkExperience) return "Work Experience"
    if (credentialType.Academic) return "Academic"
    if (credentialType.Professional) return "Professional"
    if (credentialType.Achievement) return "Achievement"
    if (credentialType.Skill) return "Skill"
    if (credentialType.Other) return credentialType.Other
    return "Unknown"
  }

  const getStatusColor = (isRevoked: boolean) => {
    return isRevoked ? "bg-red-100 text-red-800 border-red-200" : "bg-green-100 text-green-800 border-green-200"
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-green-600" />
          <p className="text-gray-600">Loading credential...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="h-8 w-8 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Credential Not Found</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <Button asChild>
            <Link href="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Search
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" asChild>
              <Link href="/">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Search
              </Link>
            </Button>
            <div className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-green-600" />
              <span className="font-semibold text-green-800">dResume</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="space-y-6">
          {/* Credential Header */}
          <Card className="border-l-4 border-l-green-500">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Hash className="h-4 w-4 text-gray-500" />
                    <span className="text-sm font-mono text-gray-600">{tokenId}</span>
                  </div>
                  <CardTitle className="text-2xl">{credential?.title}</CardTitle>
                  <CardDescription className="text-base">
                    {credential?.description}
                  </CardDescription>
                </div>
                <Badge 
                  variant="outline" 
                  className={getStatusColor(credential?.isRevoked)}
                >
                  {credential?.isRevoked ? "Revoked" : "Verified"}
                  {!credential?.isRevoked && <CheckCircle className="h-3 w-3 ml-1" />}
                </Badge>
              </div>
            </CardHeader>
          </Card>

          {/* Credential Details */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Award className="h-5 w-5 mr-2 text-green-600" />
                  Credential Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Type</label>
                    <p className="text-sm">{getCredentialTypeDisplay(credential?.credentialType)}</p>
                  </div>
                  <Separator />
                  <div>
                    <label className="text-sm font-medium text-gray-500">Recipient</label>
                    <p className="text-sm">{credential?.recipientName}</p>
                  </div>
                  <Separator />
                  <div>
                    <label className="text-sm font-medium text-gray-500">Issued Date</label>
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <p className="text-sm">{formatDate(credential?.issuedAt)}</p>
                    </div>
                  </div>
                  {credential?.expiresAt && credential.expiresAt.length > 0 && (
                    <>
                      <Separator />
                      <div>
                        <label className="text-sm font-medium text-gray-500">Expires</label>
                        <div className="flex items-center space-x-2">
                          <Clock className="h-4 w-4 text-gray-400" />
                          <p className="text-sm">{formatDate(credential.expiresAt[0])}</p>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Issuer Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Building className="h-5 w-5 mr-2 text-green-600" />
                  Issuer Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Issuer ID</label>
                    <p className="text-sm font-mono break-all">{credential?.issuer?.toText()}</p>
                  </div>
                  <Separator />
                  <div>
                    <label className="text-sm font-medium text-gray-500">Verification Status</label>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <p className="text-sm text-green-700">Cryptographically Verified</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Metadata */}
          {credential?.metadata && credential.metadata.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Additional Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 md:grid-cols-2">
                  {credential.metadata.map(([key, value]: [string, string], index: number) => (
                    <div key={index} className="space-y-1">
                      <label className="text-sm font-medium text-gray-500 capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </label>
                      <p className="text-sm">{value}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* NFT Information */}
          {nft && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="h-5 w-5 mr-2 text-green-600" />
                  NFT Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Token ID</label>
                    <p className="text-sm font-mono">{nft.tokenId}</p>
                  </div>
                  <Separator />
                  <div>
                    <label className="text-sm font-medium text-gray-500">Owner</label>
                    <p className="text-sm font-mono break-all">{nft.owner.toText()}</p>
                  </div>
                  <Separator />
                  <div>
                    <label className="text-sm font-medium text-gray-500">Created</label>
                    <p className="text-sm">{formatDate(nft.createdAt)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Actions */}
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="outline" asChild>
                  <Link href="/">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Search Another Credential
                  </Link>
                </Button>
                <Button asChild>
                  <Link href="/auth">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Create Your Own dResume
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
