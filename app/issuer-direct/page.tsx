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
  LogOut,
} from "lucide-react"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { TokenGenerationModal } from "@/components/issuer/token-generation-modal"
import { CertificateTemplateSelector } from "@/components/issuer/certificate-template-selector"

// Mock verified issuer data
const mockVerifiedIssuer = {
  id: "tech-corp-verified",
  name: "TechCorp Inc.",
  email: "admin@techcorp.com",
  role: "Company/Organization",
  type: "CO",
  verified: true,
  verificationDate: "2025-01-15",
  principal: "verified-issuer-principal",
  organizationName: "TechCorp Inc.",
  organizationType: "Technology Company",
  website: "https://techcorp.com",
  description: "Leading technology company specializing in software development and digital transformation.",
  address: "123 Tech Street, Silicon Valley, CA 94000",
  phone: "+1 (555) 123-4567",
  registrationNumber: "TC-2025-001",
  verificationStatus: "verified",
  canGenerateTokens: true,
  tokenPrefix: "CO",
  maxTokensPerBatch: 100,
  totalTokensGenerated: 42,
  activeCredentials: 38,
  totalRecipients: 35,
}

export default function IssuerDirectPage() {
  const router = useRouter()
  const [isTokenModalOpen, setIsTokenModalOpen] = useState(false)
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false)
  const [generatedTokens, setGeneratedTokens] = useState<string[]>([])
  const [tokenFiles, setTokenFiles] = useState<{[key: string]: File | null}>({})
  const [isSaving, setIsSaving] = useState(false)
  const [user] = useState(mockVerifiedIssuer)

  const handleGenerateTokens = (count: number) => {
    const newTokens: string[] = []
    const startNumber = user.totalTokensGenerated + 1
    
    for (let i = 0; i < count; i++) {
      const tokenNumber = String(startNumber + i).padStart(3, '0')
      const tokenId = `${user.tokenPrefix}-2025-${tokenNumber}`
      newTokens.push(tokenId)
    }
    
    setGeneratedTokens(newTokens)
    
    // Initialize file storage for new tokens
    const newTokenFiles: {[key: string]: File | null} = {}
    newTokens.forEach(token => {
      newTokenFiles[token] = null
    })
    setTokenFiles(newTokenFiles)
  }

  const handleFileUpload = (tokenId: string, file: File | null) => {
    setTokenFiles(prev => ({
      ...prev,
      [tokenId]: file
    }))
  }

  const handleSaveToBlockchain = async () => {
    setIsSaving(true)
    try {
      // Create credentials for each token
      const credentials = generatedTokens.map(tokenId => ({
        tokenId,
        title: `Professional Certificate`,
        description: `Certificate issued by ${user.organizationName}`,
        issuerName: user.organizationName,
        issuerEmail: user.email,
        recipientName: "Certificate Holder",
        recipientEmail: "holder@example.com",
        issuedDate: new Date().toISOString().split('T')[0],
        metadata: {
          issuerType: user.type,
          organizationType: user.organizationType,
          verificationStatus: "verified",
          tokenPrefix: user.tokenPrefix
        },
        file: tokenFiles[tokenId]
      }))

      // Simulate saving to deployed canisters
      console.log('Saving to credentials canister: k7fau-4yaaa-aaaao-qkb2a-cai')
      console.log('Saving to storage canister: kyega-raaaa-aaaao-qkb2q-cai')

      // Simulate API call to deployed canisters
      await new Promise(resolve => setTimeout(resolve, 3000))

      // Clear generated tokens after saving
      setGeneratedTokens([])
      setTokenFiles({})

      alert(`Successfully saved ${credentials.length} credentials to IC Network!\n\nCredentials Canister: k7fau-4yaaa-aaaao-qkb2a-cai\nStorage Canister: kyega-raaaa-aaaao-qkb2q-cai`)
    } catch (error) {
      console.error('Error saving to blockchain:', error)
      alert('Error saving credentials to IC Network. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const handleLogout = () => {
    router.push('/')
  }

  const getRoleDisplayName = () => {
    const roleMap: {[key: string]: string} = {
      'Educational institution': 'Educational Institution',
      'Company/Organization': 'Company/Organization', 
      'Certification Body': 'Certification Body',
      'NGO/Non-Profit': 'NGO/Non-Profit',
      'Platform/Marketplace': 'Platform/Marketplace'
    }
    return roleMap[user.role] || user.role
  }

  const isUserVerified = user.verified
  const isUserPending = false

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
          <div className="flex items-center gap-3">
            <Badge variant="secondary" className="text-sm bg-green-100 text-green-800">
              ✓ Verified Issuer
            </Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="flex items-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>

        {/* Verification Status */}
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-green-600" />
              <CardTitle className="text-green-800">Verified Issuer Status</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <p className="text-sm text-green-700">
                  <strong>Organization:</strong> {user.organizationName}
                </p>
                <p className="text-sm text-green-700">
                  <strong>Type:</strong> {user.organizationType}
                </p>
                <p className="text-sm text-green-700">
                  <strong>Verified:</strong> {user.verificationDate}
                </p>
              </div>
              <div>
                <p className="text-sm text-green-700">
                  <strong>Token Prefix:</strong> {user.tokenPrefix}
                </p>
                <p className="text-sm text-green-700">
                  <strong>Registration:</strong> {user.registrationNumber}
                </p>
                <p className="text-sm text-green-700">
                  <strong>Status:</strong> Active & Verified
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Generate Tokens
              </CardTitle>
              <CardDescription>
                Create new credential tokens for your organization
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={() => setIsTokenModalOpen(true)}
                className="w-full"
                disabled={!isUserVerified}
              >
                Generate New Tokens
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Certificate Builder
              </CardTitle>
              <CardDescription>
                Create professional certificates with templates
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                variant="outline" 
                onClick={() => router.push('/certificate-builder')}
                className="w-full"
              >
                Open Certificate Builder
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Generated Tokens Section */}
        {generatedTokens.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Generated Tokens</CardTitle>
              <CardDescription>
                Upload files and save tokens to blockchain
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {generatedTokens.map((token) => (
                  <div key={token} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Badge variant="outline">{token}</Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(token)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex items-center gap-2">
                      <Input
                        type="file"
                        accept=".pdf,.png,.jpg,.jpeg"
                        onChange={(e) => handleFileUpload(token, e.target.files?.[0] || null)}
                        className="w-48"
                      />
                      {tokenFiles[token] && (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      )}
                    </div>
                  </div>
                ))}
                
                <div className="flex justify-end pt-4">
                  <Button 
                    onClick={handleSaveToBlockchain}
                    disabled={isSaving || generatedTokens.some(token => !tokenFiles[token])}
                    className="flex items-center gap-2"
                  >
                    {isSaving ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Upload className="h-4 w-4" />
                    )}
                    {isSaving ? 'Saving...' : 'Save to Blockchain'}
                  </Button>
                </div>
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
              <div className="text-2xl font-bold">{user.totalTokensGenerated}</div>
              <p className="text-xs text-muted-foreground">Generated tokens</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Credentials</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{user.activeCredentials}</div>
              <p className="text-xs text-muted-foreground">Verified credentials</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Recipients</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{user.totalRecipients}</div>
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
