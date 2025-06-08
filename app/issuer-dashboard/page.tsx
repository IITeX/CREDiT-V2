"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import {
  Shield,
  Plus,
  Copy,
  Upload,
  FileText,
  CheckCircle,
  Clock,
  Award,
  Users,
  Loader2,
  ExternalLink,
  Download,
  Edit,
} from "lucide-react"
import { AuthGuard } from "@/components/auth/auth-guard"
import { ICErrorBoundary } from "@/components/error/ic-error-boundary"
import { NetworkStatus } from "@/components/error/network-status"
import { useAuth } from "@/contexts/auth-context"
import { useUserManagement, useCredentials } from "@/hooks/useIC"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { TokenGenerationModal } from "@/components/issuer/token-generation-modal"
import { CertificateTemplateSelector } from "@/components/issuer/certificate-template-selector"

export default function IssuerDashboardPage() {
  return (
    <AuthGuard requireRegistration={false}>
      <ICErrorBoundary>
        <NetworkStatus />
        <IssuerDashboardContent />
      </ICErrorBoundary>
    </AuthGuard>
  )
}

function IssuerDashboardContent() {
  const { principal } = useAuth()
  const router = useRouter()
  const [isTokenModalOpen, setIsTokenModalOpen] = useState(false)
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false)
  const [generatedTokens, setGeneratedTokens] = useState<string[]>([])
  const [tokenFiles, setTokenFiles] = useState<{[key: string]: File | null}>({})
  const [isSaving, setIsSaving] = useState(false)

  // ICP hooks
  const { user, getMyProfile, loading: userLoading } = useUserManagement()
  const { createCredential } = useCredentials()

  // Load user data on mount
  useEffect(() => {
    if (principal) {
      getMyProfile().catch(console.error)
    }
  }, [principal, getMyProfile])

  // Redirect non-issuers to individual dashboard
  useEffect(() => {
    if (user && user.role) {
      const userRole = Object.keys(user.role)[0]
      const isIssuer = userRole !== "Individual"
      
      if (!isIssuer) {
        router.push('/dashboard')
        return
      }
    }
  }, [user, router])

  // Check verification status
  const isUserVerified = user?.verificationStatus &&
    (Object.keys(user.verificationStatus)[0] === 'Approved' ||
     Object.keys(user.verificationStatus)[0] === 'verified' ||
     Object.keys(user.verificationStatus)[0] === 'Verified')

  const isUserPending = user?.verificationStatus &&
    (Object.keys(user.verificationStatus)[0] === 'Pending' ||
     Object.keys(user.verificationStatus)[0] === 'pending' ||
     Object.keys(user.verificationStatus)[0] === 'UnderReview')

  const handleGenerateTokens = (count: number) => {
    const tokens = []
    for (let i = 0; i < count; i++) {
      // Generate token in format like CS-2025-001
      const year = new Date().getFullYear()
      const sequence = String(i + 1).padStart(3, '0')
      const prefix = getTokenPrefix()
      tokens.push(`${prefix}-${year}-${sequence}`)
    }
    setGeneratedTokens(tokens)
    
    // Initialize token files object
    const initialFiles: {[key: string]: File | null} = {}
    tokens.forEach(token => {
      initialFiles[token] = null
    })
    setTokenFiles(initialFiles)
  }

  const getTokenPrefix = () => {
    if (!user?.role) return 'TK'
    const role = Object.keys(user.role)[0]
    switch (role) {
      case 'Educational': return 'ED'
      case 'Company': return 'CO'
      case 'CertificationBody': return 'CB'
      case 'NGO': return 'NG'
      case 'Platform': return 'PL'
      default: return 'TK'
    }
  }

  const handleFileUpload = (tokenId: string, file: File) => {
    setTokenFiles(prev => ({
      ...prev,
      [tokenId]: file
    }))
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    // You could add a toast notification here
  }

  const handleSaveTokens = async () => {
    if (!principal || !user) {
      alert('Authentication required. Please login first.')
      return
    }

    setIsSaving(true)
    try {
      console.log('Saving tokens to blockchain:', generatedTokens)
      console.log('Token files:', tokenFiles)

      // Save each token as a credential to the blockchain
      const savePromises = generatedTokens.map(async (tokenId) => {
        const file = tokenFiles[tokenId]
        if (!file) {
          throw new Error(`No file uploaded for token ${tokenId}`)
        }

        // Create credential metadata
        const metadata = {
          tokenId,
          issuerRole: Object.keys(user.role)[0],
          issuerName: user.email,
          fileName: file.name,
          fileSize: file.size.toString(),
          fileType: file.type,
          issuedAt: new Date().toISOString(),
          type: 'issuer-created'
        }

        // Create credential using the existing hook
        const result = await createCredential(
          { IssuerCertificate: null }, // Credential type for issuer-created certificates
          `Certificate - ${tokenId}`, // Title
          `Certificate issued by ${getRoleDisplayName()}`, // Description
          'pending-recipient', // Recipient (to be assigned later)
          'Pending Assignment', // Recipient name
          metadata, // Metadata
          [], // Document hash (empty for now)
          [] // Expires at (optional)
        )

        console.log(`Token ${tokenId} saved successfully:`, result)
        return result
      })

      // Wait for all tokens to be saved
      const results = await Promise.all(savePromises)

      console.log('All tokens saved successfully:', results)
      alert(`Successfully saved ${generatedTokens.length} tokens to the blockchain!`)

      // Reset state after successful save
      setGeneratedTokens([])
      setTokenFiles({})
    } catch (error) {
      console.error('Error saving tokens:', error)
      alert(`Failed to save tokens: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsSaving(false)
    }
  }

  const getRoleDisplayName = () => {
    if (!user?.role) return 'Issuer'
    const role = Object.keys(user.role)[0]
    switch (role) {
      case 'Educational': return 'Educational Institution'
      case 'Company': return 'Company/Organization'
      case 'CertificationBody': return 'Certification Body'
      case 'NGO': return 'NGO/Non-Profit'
      case 'Platform': return 'Platform/Marketplace'
      default: return 'Issuer'
    }
  }

  if (userLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <Loader2 className="h-12 w-12 text-green-600 mx-auto mb-4 animate-spin" />
            <h2 className="text-xl font-semibold mb-2">Loading Dashboard</h2>
            <p className="text-gray-600">Please wait while we load your profile...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <DashboardLayout
      user={user}
      isUserVerified={isUserVerified}
      isUserPending={isUserPending}
      onCreateCredential={() => setIsTokenModalOpen(true)}
      isIssuer={true}
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Issuer Dashboard</h1>
            <p className="text-gray-600 mt-1">
              Welcome back, {getRoleDisplayName()}
            </p>
          </div>
          <Badge variant="secondary" className="text-sm">
            {getRoleDisplayName()}
          </Badge>
        </div>

        {/* Verification Status */}
        {!isUserVerified && (
          <Card className="border-yellow-200 bg-yellow-50">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-yellow-600" />
                <div>
                  <p className="font-medium text-yellow-800">Verification Pending</p>
                  <p className="text-sm text-yellow-700">
                    Your account is under review. You'll be able to generate tokens once verified.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Token Generation Section */}
        {isUserVerified && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Award className="h-5 w-5" />
                <span>Token Generation</span>
              </CardTitle>
              <CardDescription>
                Generate credential tokens and upload associated files
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                onClick={() => setIsTokenModalOpen(true)}
                className="w-full sm:w-auto"
              >
                <Plus className="h-4 w-4 mr-2" />
                Generate Tokens
              </Button>

              {/* Generated Tokens Display */}
              {generatedTokens.length > 0 && (
                <div className="space-y-4">
                  <div className="border rounded-lg p-4 bg-gray-50">
                    <h3 className="font-semibold mb-3">Generated Tokens</h3>
                    <div className="space-y-2">
                      {generatedTokens.map((token, index) => (
                        <div key={token} className="flex items-center justify-between p-3 bg-white rounded border">
                          <div className="flex items-center space-x-3">
                            <span className="font-mono text-sm">{token}</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => copyToClipboard(token)}
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Input
                              type="file"
                              accept=".pdf,.png,.jpg,.jpeg"
                              onChange={(e) => {
                                const file = e.target.files?.[0]
                                if (file) handleFileUpload(token, file)
                              }}
                              className="hidden"
                              id={`file-${token}`}
                            />
                            <Label
                              htmlFor={`file-${token}`}
                              className="cursor-pointer"
                            >
                              <Button variant="outline" size="sm" asChild>
                                <span>
                                  <Upload className="h-4 w-4 mr-2" />
                                  {tokenFiles[token] ? 'Change File' : 'Upload File'}
                                </span>
                              </Button>
                            </Label>
                            {tokenFiles[token] && (
                              <CheckCircle className="h-4 w-4 text-green-600" />
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Save Button */}
                  <div className="flex justify-between items-center">
                    <Button
                      onClick={handleSaveTokens}
                      disabled={isSaving || Object.values(tokenFiles).some(file => !file)}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      {isSaving ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Save All Tokens
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              )}

              {/* Certificate Creation Link */}
              <div className="pt-4 border-t">
                <p className="text-sm text-gray-600 mb-2">
                  Don't have a certificate yet?
                </p>
                <Button
                  variant="outline"
                  onClick={() => setIsTemplateModalOpen(true)}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Create Certificate
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Tokens</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">Generated tokens</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Credentials</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">Verified credentials</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Recipients</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">Credential holders</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Modals */}
      <TokenGenerationModal
        open={isTokenModalOpen}
        onOpenChange={setIsTokenModalOpen}
        onGenerate={handleGenerateTokens}
      />

      <CertificateTemplateSelector
        open={isTemplateModalOpen}
        onOpenChange={setIsTemplateModalOpen}
      />
    </DashboardLayout>
  )
}
