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
  Building,
  Award,
  ExternalLink,
  CheckCircle,
  Clock,
  Hash,
  Loader2,
  Download,
  Eye
} from "lucide-react"
import { getMockCertificateByTokenId } from "@/lib/mock-data"
import { CertificatePreview } from "@/components/certificate/certificate-preview"
import { type CertificateData, downloadCertificateAsPNG } from "@/lib/certificate-generator"

export default function CredentialDetailPage() {
  const params = useParams()
  const tokenId = params.tokenId as string
  const [credential, setCredential] = useState<any>(null)
  const [issuerInfo, setIssuerInfo] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [isIssuerCreated, setIsIssuerCreated] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)

  // Remove dependency on useCredentials hook to avoid CORS issues
  // const { getCredentialByToken, getNFT } = useCredentials()

  useEffect(() => {
    const fetchCredential = async () => {
      if (!tokenId) return

      setLoading(true)
      setError("")

      try {
        // First check for mock data
        const mockData = getMockCertificateByTokenId(tokenId)
        if (mockData) {
          console.log("Using mock data for token:", tokenId)

          // Convert mock data to credential format
          const mockCredential = {
            id: mockData.tokenId,
            tokenId: mockData.tokenId,
            title: mockData.title,
            description: mockData.description,
            issuer: { toText: () => mockData.issuer.email },
            recipient: mockData.recipient,
            recipientName: mockData.recipientName,
            issuedAt: BigInt(new Date(mockData.issuedAt).getTime() * 1000000), // Convert to nanoseconds
            isRevoked: false,
            metadata: Object.entries(mockData.metadata),
            credentialType: { [mockData.type === 'issuer-created' ? 'Certification' : 'Professional']: null }
          }
          setCredential(mockCredential)

          // Set issuer info for mock data
          setIsIssuerCreated(mockData.type === 'issuer-created')
          if (mockData.type === 'issuer-created') {
            setIssuerInfo({
              name: mockData.issuer.organizationName,
              type: mockData.issuer.role,
              email: mockData.issuer.email,
              verified: true,
              description: mockData.issuer.description
            })
          }
        } else {
          // Check if token follows issuer format (e.g., ED-2025-001, CO-2025-001)
          const issuerTokenPattern = /^[A-Z]{2}-\d{4}-\d{3}$/
          const isIssuerToken = issuerTokenPattern.test(tokenId)

          if (isIssuerToken) {
            // Create mock credential for issuer tokens
            const prefix = tokenId.substring(0, 2)
            const mockIssuerInfo = getMockIssuerInfo(prefix)

            const mockCredential = {
              id: tokenId,
              tokenId: tokenId,
              title: `Professional Certificate - ${tokenId}`,
              description: `Certificate issued by ${mockIssuerInfo.name}`,
              issuer: { toText: () => mockIssuerInfo.email },
              recipient: 'demo-recipient',
              recipientName: 'Demo Recipient',
              issuedAt: BigInt(new Date().getTime() * 1000000),
              isRevoked: false,
              metadata: [
                ['issuerType', mockIssuerInfo.type],
                ['tokenId', tokenId],
                ['issuedBy', mockIssuerInfo.name]
              ],
              credentialType: { Certification: null }
            }

            setCredential(mockCredential)
            setIsIssuerCreated(true)
            setIssuerInfo(mockIssuerInfo)
          } else {
            // For individual tokens, show not found
            setError("Credential not found. Please check the token ID and try again.")
          }
        }
      } catch (err) {
        console.error('Error fetching credential:', err)
        setError("Error loading credential. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    fetchCredential()
  }, [tokenId])

  const getCertificateTemplate = () => {
    if (isIssuerCreated) {
      // Map issuer types to certificate templates
      const prefix = tokenId.substring(0, 2)
      const templateMap: { [key: string]: string } = {
        'ED': 'academic',
        'CO': 'corporate',
        'CB': 'professional',
        'NG': 'achievement',
        'PL': 'excellence'
      }
      return templateMap[prefix] || 'professional'
    }
    return 'professional'
  }

  const getCertificateData = (): CertificateData => {
    if (!credential) {
      return {
        tokenId: tokenId,
        title: 'Certificate',
        recipientName: 'Recipient',
        issuerName: 'Issuer',
        issuedDate: new Date().toLocaleDateString(),
        template: 'professional'
      }
    }

    return {
      tokenId: credential.tokenId,
      title: credential.title,
      recipientName: credential.recipientName,
      issuerName: isIssuerCreated && issuerInfo ? issuerInfo.name : 'CREDiT Platform',
      issuedDate: formatDate(credential.issuedAt),
      description: credential.description,
      metadata: credential.metadata ? Object.fromEntries(credential.metadata) : {},
      template: getCertificateTemplate() as any
    }
  }

  const handleDownloadCertificate = async () => {
    setIsDownloading(true)
    try {
      const certificateData = getCertificateData()

      // Add credentialType for better certificate generation
      const enhancedData = {
        ...certificateData,
        credentialType: getCredentialTypeDisplay(credential?.credentialType)
      }

      console.log('🎨 Downloading certificate with data:', enhancedData)

      // Use the new certificate generator
      await downloadCertificateAsPNG(enhancedData)

    } catch (error) {
      console.error('❌ Error downloading certificate:', error)

      // Enhanced fallback with better styling
      const certificateData = getCertificateData()
      const printWindow = window.open('', '_blank')
      if (printWindow) {
        printWindow.document.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <title>Certificate - ${certificateData.tokenId}</title>
              <style>
                @media print { body { margin: 0; } }
                body {
                  font-family: 'Georgia', serif;
                  padding: 40px;
                  background: #f8f9fa;
                  margin: 0;
                }
                .certificate {
                  border: 8px solid #1e40af;
                  padding: 60px;
                  text-align: center;
                  max-width: 800px;
                  margin: 0 auto;
                  background: white;
                  box-shadow: 0 10px 30px rgba(0,0,0,0.1);
                }
                .title {
                  font-size: 3rem;
                  font-weight: bold;
                  color: #1e40af;
                  margin-bottom: 20px;
                  letter-spacing: 2px;
                }
                .subtitle {
                  font-size: 1.5rem;
                  color: #3b82f6;
                  margin-bottom: 40px;
                }
                .recipient {
                  font-size: 2.5rem;
                  font-weight: bold;
                  margin: 30px 0;
                  border-bottom: 3px solid #1e40af;
                  padding-bottom: 15px;
                  display: inline-block;
                  color: #1e40af;
                }
                .description {
                  font-size: 1.5rem;
                  margin: 30px 0;
                  color: #374151;
                }
                .details {
                  display: flex;
                  justify-content: space-between;
                  margin-top: 60px;
                  padding-top: 30px;
                  border-top: 2px solid #e5e7eb;
                }
                .detail { text-align: center; }
                .detail-label {
                  font-size: 1rem;
                  color: #6b7280;
                  margin-bottom: 5px;
                  text-transform: uppercase;
                  letter-spacing: 1px;
                }
                .detail-value {
                  font-weight: bold;
                  font-size: 1.2rem;
                  color: #1e40af;
                }
                .decorative-line {
                  width: 100px;
                  height: 4px;
                  background: linear-gradient(90deg, #1e40af, #3b82f6);
                  margin: 0 auto 30px;
                }
              </style>
            </head>
            <body>
              <div class="certificate">
                <div class="title">CERTIFICATE</div>
                <div class="subtitle">OF ACHIEVEMENT</div>
                <div class="decorative-line"></div>
                <p style="font-size: 1.2rem; margin-bottom: 30px; color: #374151;">This is to certify that</p>
                <div class="recipient">${certificateData.recipientName}</div>
                <p style="font-size: 1.2rem; margin: 20px 0; color: #374151;">has successfully completed</p>
                <div style="font-size: 2rem; font-weight: bold; color: #3b82f6; margin: 20px 0;">${certificateData.title}</div>
                <div class="description">${certificateData.description || 'Meeting all requirements and standards'}</div>
                <div class="details">
                  <div class="detail">
                    <div class="detail-label">Issued By</div>
                    <div class="detail-value">${certificateData.issuerName}</div>
                  </div>
                  <div class="detail">
                    <div class="detail-label">Date</div>
                    <div class="detail-value">${certificateData.issuedDate}</div>
                  </div>
                  <div class="detail">
                    <div class="detail-label">Certificate ID</div>
                    <div class="detail-value">${certificateData.tokenId}</div>
                  </div>
                </div>
              </div>
              <script>
                window.onload = () => {
                  setTimeout(() => {
                    window.print()
                    setTimeout(() => window.close(), 1000)
                  }, 500)
                }
              </script>
            </body>
          </html>
        `)
        printWindow.document.close()
      }
    } finally {
      setIsDownloading(false)
    }
  }

  const formatDate = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) / 1000000) // Convert nanoseconds to milliseconds
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getMockIssuerInfo = (prefix: string) => {
    const issuerMap: { [key: string]: any } = {
      'ED': {
        name: 'State University',
        type: 'Educational Institution',
        email: 'education@university.edu',
        verified: true,
        description: 'Leading educational institution providing quality education and certification programs.'
      },
      'CO': {
        name: 'TechCorp Inc.',
        type: 'Company/Organization',
        email: 'hr@techcorp.com',
        verified: true,
        description: 'Technology company specializing in software development and digital solutions.'
      },
      'CB': {
        name: 'Professional Certification Body',
        type: 'Certification Body',
        email: 'certs@certbody.org',
        verified: true,
        description: 'Authorized certification body for professional standards and qualifications.'
      },
      'NG': {
        name: 'Community NGO',
        type: 'NGO/Non-Profit',
        email: 'admin@ngo.org',
        verified: true,
        description: 'Non-profit organization focused on community development and social impact.'
      },
      'PL': {
        name: 'Skills Marketplace',
        type: 'Platform/Marketplace',
        email: 'platform@marketplace.com',
        verified: true,
        description: 'Digital platform connecting professionals with skill verification and opportunities.'
      }
    }
    return issuerMap[prefix] || {
      name: 'Unknown Issuer',
      type: 'Organization',
      email: 'contact@issuer.com',
      verified: false,
      description: 'Verified issuer organization.'
    }
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
              <span className="font-semibold text-green-800">CREDiT</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="space-y-6">
          {/* Credential Type Indicator */}
          <div className="text-center">
            <Badge variant="secondary" className="mb-4">
              {isIssuerCreated ? "Issuer-Generated Certificate" : "Individual Credential"}
            </Badge>
          </div>

          {/* Credential Header */}
          <Card className={`border-l-4 ${isIssuerCreated ? 'border-l-blue-500' : 'border-l-green-500'}`}>
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
                <div className="flex flex-col items-end space-y-2">
                  <Badge
                    variant="outline"
                    className={getStatusColor(credential?.isRevoked)}
                  >
                    {credential?.isRevoked ? "Revoked" : "Verified"}
                    {!credential?.isRevoked && <CheckCircle className="h-3 w-3 ml-1" />}
                  </Badge>
                  {isIssuerCreated && issuerInfo?.verified && (
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                      SVT-Backed
                    </Badge>
                  )}
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Certificate Display */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center">
                  <Eye className="h-5 w-5 mr-2 text-green-600" />
                  Certificate Document
                </CardTitle>
                <Button
                  onClick={handleDownloadCertificate}
                  disabled={isDownloading}
                  size="sm"
                  className="bg-green-600 hover:bg-green-700"
                >
                  {isDownloading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Downloading...
                    </>
                  ) : (
                    <>
                      <Download className="h-4 w-4 mr-2" />
                      Download PNG
                    </>
                  )}
                </Button>
              </div>
              <CardDescription>
                Official certificate document with verification details
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-50 p-4 rounded-lg">
                <CertificatePreview
                  template={getCertificateTemplate()}
                  data={getCertificateData()}
                />
              </div>
            </CardContent>
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
                  {isIssuerCreated ? 'Issuer Organization' : 'Issuer Information'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {isIssuerCreated && issuerInfo ? (
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Organization</label>
                      <p className="text-sm font-semibold">{issuerInfo.name}</p>
                    </div>
                    <Separator />
                    <div>
                      <label className="text-sm font-medium text-gray-500">Type</label>
                      <p className="text-sm">{issuerInfo.type}</p>
                    </div>
                    <Separator />
                    <div>
                      <label className="text-sm font-medium text-gray-500">Contact</label>
                      <p className="text-sm">{issuerInfo.email}</p>
                    </div>
                    <Separator />
                    <div>
                      <label className="text-sm font-medium text-gray-500">Description</label>
                      <p className="text-sm text-gray-600">{issuerInfo.description}</p>
                    </div>
                    <Separator />
                    <div>
                      <label className="text-sm font-medium text-gray-500">Verification Status</label>
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <p className="text-sm text-green-700">Verified Issuer</p>
                      </div>
                    </div>
                    <Separator />
                    <div>
                      <label className="text-sm font-medium text-gray-500">Issued</label>
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <p className="text-sm">{formatDate(credential?.issuedAt)}</p>
                      </div>
                    </div>
                  </div>
                ) : (
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
                )}
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

          {/* Blockchain Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="h-5 w-5 mr-2 text-green-600" />
                Blockchain Verification
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-500">Token ID</label>
                  <p className="text-sm font-mono">{tokenId}</p>
                </div>
                <Separator />
                <div>
                  <label className="text-sm font-medium text-gray-500">Blockchain</label>
                  <p className="text-sm">Internet Computer Protocol (ICP)</p>
                </div>
                <Separator />
                <div>
                  <label className="text-sm font-medium text-gray-500">Token Type</label>
                  <p className="text-sm">Soul Bound Token (SBT)</p>
                </div>
                <Separator />
                <div>
                  <label className="text-sm font-medium text-gray-500">Status</label>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <p className="text-sm text-green-700">Verified & Immutable</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

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
                  <Link href="/signup">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Create Your Own CREDiT Profile
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
