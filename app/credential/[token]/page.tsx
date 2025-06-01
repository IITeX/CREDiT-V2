"use client"

import { notFound } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  ArrowLeft,
  Download,
  ExternalLink,
  Copy,
  Linkedin,
  Shield,
  CheckCircle,
  Calendar,
  User,
  Building,
} from "lucide-react"
import Link from "next/link"

// Sample credential data
const sampleCredentials = {
  "CS-2025-001": {
    id: "CS-2025-001",
    title: "Bachelor of Computer Science",
    type: "Academic Certificate",
    status: "verified",
    recipient: {
      name: "Alice Johnson",
      email: "alice.johnson@email.com",
    },
    issuer: {
      name: "MIT - Massachusetts Institute of Technology",
      type: "Educational Institution",
      verified: true,
    },
    issueDate: "5/15/2025",
    description:
      "Completed a comprehensive 4-year program in Computer Science with focus on software engineering, algorithms, and data structures. Graduated with distinction.",
    grade: "Summa Cum Laude (GPA: 3.9/4.0)",
    skills: ["JavaScript", "Python", "React", "Node.js", "Machine Learning", "Data Structures", "Algorithms"],
    blockchain: {
      tokenId: "0x2825c883",
      blockchainHash: "0x123456789abcdef123456789abcdef123456789",
      ipfsHash: "QmYeaP2zvCZrAe3rYZ4AK6BLG9B34C1RiB3DGKxALimGS",
    },
    documentUrl: "/placeholder.svg?height=400&width=600",
  },
  "WE-2024-042": {
    id: "WE-2024-042",
    title: "Senior Software Engineer",
    type: "Work Experience",
    status: "verified",
    recipient: {
      name: "John Smith",
      email: "john.smith@email.com",
    },
    issuer: {
      name: "TechCorp Solutions",
      type: "Company/Employer",
      verified: true,
    },
    issueDate: "12/20/2024",
    description:
      "Led a team of 5 developers in building scalable web applications. Responsible for architecture decisions, code reviews, and mentoring junior developers. Successfully delivered 3 major projects on time.",
    grade: "Excellent Performance Rating",
    skills: ["React", "TypeScript", "AWS", "Docker", "Team Leadership", "System Architecture", "Agile"],
    blockchain: {
      tokenId: "0x4729b991",
      blockchainHash: "0x987654321fedcba987654321fedcba987654321",
      ipfsHash: "QmXdP9K2vCZrBe4rYZ5BL7CG8B45D2SjC4EHLxBMjnHT",
    },
    documentUrl: "/placeholder.svg?height=400&width=600",
  },
  "CERT-2024-156": {
    id: "CERT-2024-156",
    title: "AWS Solutions Architect Professional",
    type: "Professional Certification",
    status: "verified",
    recipient: {
      name: "Sarah Davis",
      email: "sarah.davis@email.com",
    },
    issuer: {
      name: "Amazon Web Services",
      type: "Certification Body",
      verified: true,
    },
    issueDate: "8/10/2024",
    description:
      "Demonstrates advanced technical skills and experience in designing distributed applications and systems on the AWS platform. Validates ability to design and deploy scalable, highly available systems.",
    grade: "Certified Professional",
    skills: ["AWS", "Cloud Architecture", "DevOps", "Security", "Scalability", "Cost Optimization"],
    blockchain: {
      tokenId: "0x6834a772",
      blockchainHash: "0xabcdef123456789abcdef123456789abcdef123456789",
      ipfsHash: "QmZfR8P3vCZrCe5rYZ6CM8DH9C56E3TkD5FIMyCNkoIU",
    },
    documentUrl: "/placeholder.svg?height=400&width=600",
  },
}

interface CredentialPageProps {
  params: {
    token: string
  }
}

export default function CredentialPage({ params }: CredentialPageProps) {
  const credential = sampleCredentials[params.token as keyof typeof sampleCredentials]

  if (!credential) {
    notFound()
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href)
  }

  const handleShare = (platform: string) => {
    const url = window.location.href
    const text = `Check out this verified credential: ${credential.title}`

    switch (platform) {
      case "linkedin":
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`)
        break
      default:
        break
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-4">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center text-gray-600 hover:text-gray-900">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Search
            </Link>
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="text-green-600 font-medium">Verified Credential</span>
            </div>
          </div>
          <div className="text-xl font-bold">dResume</div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Credential Header */}
            <Card className="card-clean">
              <CardHeader className="pb-4">
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <Shield className="h-8 w-8 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-2xl font-bold text-gray-900 mb-2">{credential.title}</CardTitle>
                    <div className="flex items-center space-x-4">
                      <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                        {credential.type}
                      </Badge>
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Issued
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Supporting Document */}
            <Card className="card-clean">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold flex items-center">
                    <Download className="h-5 w-5 mr-2" />
                    Supporting Document
                  </CardTitle>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                    <Button variant="outline" size="sm">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Full Size
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-100 rounded-lg p-8 text-center">
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-gray-700">Certificate Document</h3>
                    <div className="space-y-2 text-gray-600">
                      <p className="font-medium">{credential.title}</p>
                      <p>{credential.issuer.name}</p>
                      <p className="text-sm">Awarded to: {credential.recipient.name}</p>
                      <p className="text-sm">Date: {credential.issueDate}</p>
                    </div>
                    <div className="mt-6">
                      <div className="inline-flex items-center px-3 py-1 rounded-full bg-green-100 text-green-800 text-sm">
                        <CheckCircle className="h-4 w-4 mr-1" />
                        VERIFIED
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Description */}
            <Card className="card-clean">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Description</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700 leading-relaxed">{credential.description}</p>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Grade/Achievement</h4>
                  <p className="text-gray-700">{credential.grade}</p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Skills & Competencies</h4>
                  <div className="flex flex-wrap gap-2">
                    {credential.skills.map((skill) => (
                      <Badge key={skill} variant="outline" className="bg-gray-50">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Calendar className="h-4 w-4" />
                  <span>Issue Date: {credential.issueDate}</span>
                </div>
              </CardContent>
            </Card>

            {/* Blockchain Verification */}
            <Card className="card-clean">
              <CardHeader>
                <CardTitle className="text-lg font-semibold flex items-center">
                  <Shield className="h-5 w-5 mr-2" />
                  Blockchain Verification
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600 mb-4">
                  This credential is permanently recorded on the Internet Computer blockchain
                </p>

                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Token ID</label>
                    <div className="flex items-center space-x-2 mt-1">
                      <code className="flex-1 px-3 py-2 bg-gray-100 rounded text-sm font-mono">
                        {credential.blockchain.tokenId}
                      </code>
                      <Button variant="outline" size="sm" onClick={handleCopyLink}>
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700">Blockchain Hash</label>
                    <div className="flex items-center space-x-2 mt-1">
                      <code className="flex-1 px-3 py-2 bg-gray-100 rounded text-sm font-mono break-all">
                        {credential.blockchain.blockchainHash}
                      </code>
                      <Button variant="outline" size="sm">
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700">IPFS Hash</label>
                    <div className="flex items-center space-x-2 mt-1">
                      <code className="flex-1 px-3 py-2 bg-gray-100 rounded text-sm font-mono break-all">
                        {credential.blockchain.ipfsHash}
                      </code>
                      <Button variant="outline" size="sm">
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Recipient */}
            <Card className="card-clean">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-semibold flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  Recipient
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="font-medium text-gray-900">{credential.recipient.name}</p>
                  <p className="text-sm text-gray-600">{credential.recipient.email}</p>
                </div>
              </CardContent>
            </Card>

            {/* Issuer */}
            <Card className="card-clean">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-semibold flex items-center">
                  <Building className="h-5 w-5 mr-2" />
                  Issuer
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <p className="font-medium text-gray-900">{credential.issuer.name}</p>
                    <p className="text-sm text-gray-600">{credential.issuer.type}</p>
                  </div>
                  {credential.issuer.verified && (
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm text-green-600 font-medium">Verified Issuer</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Share Credential */}
            <Card className="card-clean">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-semibold">Share Credential</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full bg-gray-900 hover:bg-gray-800 text-white" onClick={handleCopyLink}>
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Link
                </Button>
                <Button variant="outline" className="w-full" onClick={() => handleShare("linkedin")}>
                  <Linkedin className="h-4 w-4 mr-2" />
                  Add to LinkedIn
                </Button>
                <Button variant="outline" className="w-full">
                  <Shield className="h-4 w-4 mr-2" />
                  Verify Credential
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
