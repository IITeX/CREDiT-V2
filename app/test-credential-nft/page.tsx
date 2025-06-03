"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  Shield, 
  CheckCircle, 
  Search, 
  Copy, 
  ExternalLink,
  Loader2,
  Hash,
  Award
} from "lucide-react"

export default function TestCredentialNFTPage() {
  const [testTokenId, setTestTokenId] = useState("CS-2025-001")
  const [searchToken, setSearchToken] = useState("")
  const [showSuccess, setShowSuccess] = useState(false)

  // Mock credential data for testing
  const mockCredential = {
    id: "test-credential-1",
    title: "AWS Solutions Architect",
    description: "Professional cloud architecture certification demonstrating expertise in designing distributed systems on AWS",
    tokenId: "CS-2025-001",
    issuer: "Amazon Web Services",
    recipient: "Test User",
    recipientName: "John Doe",
    issuedAt: BigInt(Date.now() * 1000000), // Convert to nanoseconds
    expiresAt: null,
    isRevoked: false,
    credentialType: { Certification: null },
    metadata: [
      ["issuer", "Amazon Web Services"],
      ["date", "2025-01-15"],
      ["type", "certificate"],
      ["verifierEmail", "verify@aws.amazon.com"]
    ]
  }

  const mockNFT = {
    tokenId: "CS-2025-001",
    owner: "g5pqo-7ihb2-4vqek-pou4f-pauhm-tfylr-qcvnb-f5fnp-lfjs5-i7xtv-pae",
    createdAt: BigInt(Date.now() * 1000000),
    metadata: {
      name: "AWS Solutions Architect Credential",
      description: "Professional cloud architecture certification",
      image: "https://example.com/credential-image.png",
      credentialId: "test-credential-1",
      issuer: "Amazon Web Services",
      recipient: "Test User",
      issuedAt: BigInt(Date.now() * 1000000),
      attributes: [
        ["type", "Certification"],
        ["level", "Professional"],
        ["domain", "Cloud Architecture"]
      ]
    }
  }

  const simulateCredentialCreation = () => {
    setShowSuccess(true)
    setTestTokenId("CS-2025-" + String(Math.floor(Math.random() * 1000)).padStart(3, '0'))
  }

  const copyTokenId = () => {
    navigator.clipboard.writeText(testTokenId)
  }

  const testSearch = () => {
    if (searchToken.trim()) {
      window.open(`/credential/${searchToken}`, '_blank')
    }
  }

  const formatDate = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) / 1000000)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="container mx-auto max-w-4xl space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
            <Shield className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold">Credential NFT Integration Test</h1>
          <p className="text-gray-600">
            Test the credential NFT functionality without requiring backend authentication
          </p>
        </div>

        {/* Test Credential Creation */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Award className="h-5 w-5 mr-2 text-green-600" />
              Test Credential Creation
            </CardTitle>
            <CardDescription>
              Simulate creating a credential with NFT tokenization
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {!showSuccess ? (
              <div className="space-y-4">
                <Alert>
                  <Shield className="h-4 w-4" />
                  <AlertDescription>
                    This simulates the credential creation flow without requiring backend authentication.
                  </AlertDescription>
                </Alert>
                
                <Button onClick={simulateCredentialCreation} className="w-full">
                  <Award className="h-4 w-4 mr-2" />
                  Simulate Create Credential
                </Button>
              </div>
            ) : (
              <div className="space-y-6 text-center py-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">AWS Solutions Architect</h3>
                  <p className="text-gray-600">Your credential has been successfully created and tokenized!</p>
                </div>

                <Card className="bg-green-50 border-green-200">
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div className="text-sm font-medium text-green-800">Token ID</div>
                      <div className="flex items-center justify-center space-x-2">
                        <code className="px-3 py-2 bg-white border rounded font-mono text-sm">
                          {testTokenId}
                        </code>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={copyTokenId}
                          className="border-green-300 text-green-700 hover:bg-green-100"
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                      <p className="text-xs text-green-700">
                        Save this Token ID! You can use it to search and verify your credential.
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button variant="outline" onClick={() => window.open('/', '_blank')}>
                    Test Search on Homepage
                  </Button>
                  <Button onClick={() => setShowSuccess(false)}>
                    Create Another Credential
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Test Token Search */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Search className="h-5 w-5 mr-2 text-green-600" />
              Test Token Search
            </CardTitle>
            <CardDescription>
              Test searching for credentials by token ID
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex space-x-2">
              <Input
                placeholder="Enter token ID (e.g., CS-2025-001)"
                value={searchToken}
                onChange={(e) => setSearchToken(e.target.value)}
                className="flex-1"
              />
              <Button onClick={testSearch} disabled={!searchToken.trim()}>
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
            </div>
            
            <div className="text-sm text-gray-600">
              Try searching for: <code className="bg-gray-100 px-1 rounded">{testTokenId}</code>
            </div>
          </CardContent>
        </Card>

        {/* Mock Credential Display */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Hash className="h-5 w-5 mr-2 text-green-600" />
              Sample Credential Data
            </CardTitle>
            <CardDescription>
              This is what a credential looks like when stored with NFT tokenization
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Credential Info */}
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-3">
                <h4 className="font-medium">Credential Information</h4>
                <div className="space-y-2 text-sm">
                  <div><strong>Title:</strong> {mockCredential.title}</div>
                  <div><strong>Description:</strong> {mockCredential.description}</div>
                  <div><strong>Token ID:</strong> <code className="bg-gray-100 px-1 rounded">{mockCredential.tokenId}</code></div>
                  <div><strong>Type:</strong> Certification</div>
                  <div><strong>Status:</strong> <Badge className="bg-green-100 text-green-800">Verified</Badge></div>
                </div>
              </div>
              
              <div className="space-y-3">
                <h4 className="font-medium">NFT Information</h4>
                <div className="space-y-2 text-sm">
                  <div><strong>Token ID:</strong> <code className="bg-gray-100 px-1 rounded">{mockNFT.tokenId}</code></div>
                  <div><strong>Owner:</strong> <code className="bg-gray-100 px-1 rounded text-xs">{mockNFT.owner}</code></div>
                  <div><strong>Created:</strong> {formatDate(mockNFT.createdAt)}</div>
                  <div><strong>Blockchain:</strong> Internet Computer</div>
                </div>
              </div>
            </div>

            {/* Metadata */}
            <div className="space-y-3">
              <h4 className="font-medium">Metadata</h4>
              <div className="grid gap-2 md:grid-cols-2">
                {mockCredential.metadata.map(([key, value], index) => (
                  <div key={index} className="text-sm">
                    <strong className="capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}:</strong> {value}
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Integration Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <CheckCircle className="h-5 w-5 mr-2 text-green-600" />
              Integration Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <h4 className="font-medium">✅ Completed Features</h4>
                <ul className="text-sm space-y-1 text-green-700">
                  <li>• Credential creation with NFT tokenization</li>
                  <li>• Token ID generation and display</li>
                  <li>• Search functionality by token ID</li>
                  <li>• Credential detail page</li>
                  <li>• Professional UI/UX</li>
                  <li>• Error handling and loading states</li>
                </ul>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium">🔧 Backend Requirements</h4>
                <ul className="text-sm space-y-1 text-gray-600">
                  <li>• ICP replica running on localhost:4943</li>
                  <li>• Credential NFT canister deployed</li>
                  <li>• Internet Identity authentication</li>
                  <li>• User management canister</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Links */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Links</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 md:grid-cols-3">
              <Button asChild variant="outline">
                <a href="/" target="_blank">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Homepage Search
                </a>
              </Button>
              <Button asChild variant="outline">
                <a href="/dashboard-direct" target="_blank">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Dashboard (Direct)
                </a>
              </Button>
              <Button asChild variant="outline">
                <a href="/setup-admin" target="_blank">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Admin Setup
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
