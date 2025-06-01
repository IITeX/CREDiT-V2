"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  ArrowLeft,
  Shield,
  CheckCircle,
  Download,
  Maximize2,
  Copy,
  Linkedin,
  ExternalLink,
  FileText,
  User,
  Building,
  Share2,
} from "lucide-react"
import { Navbar } from "@/components/ui/navbar"

// Mock credential data
const mockCredentialData = {
  "DS2025-003": {
    id: "DS2025-003",
    title: "Bachelor of Computer Science",
    type: "Academic Certificate",
    status: "verified",
    issueDate: "May 15, 2025",
    recipient: {
      name: "Alice Johnson",
      email: "alice.johnson@email.com",
      avatar: "/placeholder.svg?height=80&width=80",
    },
    issuer: {
      name: "MIT - Massachusetts Institute of Technology",
      type: "Educational Institution",
      verified: true,
      logo: "/placeholder.svg?height=60&width=60",
    },
    description:
      "Completed a comprehensive 4-year program in Computer Science with focus on software engineering, algorithms, and data structures. Graduated with distinction.",
    grade: "Summa Cum Laude (GPA: 3.9/4.0)",
    skills: ["JavaScript", "Python", "React", "Node.js", "Machine Learning", "Data Structures", "Algorithms"],
    blockchain: {
      tokenId: "DS2025-003",
      blockchainHash: "0x123456789abcdef123456789abcdef123456789",
      ipfsHash: "QmYwAPJzv5CZsnA63GXhGFz7096Gu2h4TuSCx4T9tkHdc9",
      verifications: 47,
      lastVerified: "1/28/2025",
    },
    document: {
      url: "/placeholder.svg?height=600&width=400",
      type: "PDF Certificate",
      size: "2.4 MB",
    },
  },
  "MIT-CS-2024": {
    id: "MIT-CS-2024",
    title: "Master of Science in Computer Science",
    type: "Graduate Degree",
    status: "verified",
    issueDate: "June 10, 2024",
    recipient: {
      name: "John Smith",
      email: "john.smith@email.com",
      avatar: "/placeholder.svg?height=80&width=80",
    },
    issuer: {
      name: "MIT - Massachusetts Institute of Technology",
      type: "Educational Institution",
      verified: true,
      logo: "/placeholder.svg?height=60&width=60",
    },
    description:
      "Advanced graduate program focusing on artificial intelligence, machine learning, and distributed systems.",
    grade: "Magna Cum Laude (GPA: 3.8/4.0)",
    skills: ["AI/ML", "Deep Learning", "Distributed Systems", "Cloud Computing", "Research", "Data Science"],
    blockchain: {
      tokenId: "MIT-CS-2024",
      blockchainHash: "0x987654321fedcba987654321fedcba987654321",
      ipfsHash: "QmXwBPJzv5CZsnA63GXhGFz7096Gu2h4TuSCx4T9tkHdc8",
      verifications: 89,
      lastVerified: "2/15/2025",
    },
    document: {
      url: "/placeholder.svg?height=600&width=400",
      type: "PDF Certificate",
      size: "3.1 MB",
    },
  },
}

export default function CredentialVerificationPage() {
  const params = useParams()
  const token = params.token as string
  const [credential, setCredential] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const data = mockCredentialData[token as keyof typeof mockCredentialData]
      setCredential(data)
      setLoading(false)
    }, 1000)
  }, [token])

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleCopyHash = async (hash: string) => {
    await navigator.clipboard.writeText(hash)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30">
        <Navbar />
        <div className="pt-16 flex items-center justify-center min-h-[80vh]">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto" />
            <p className="text-gray-600">Verifying credential...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!credential) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30">
        <Navbar />
        <div className="pt-16 flex items-center justify-center min-h-[80vh]">
          <Card className="glass-card border-white/20 max-w-md">
            <CardContent className="p-8 text-center">
              <Shield className="h-16 w-16 text-red-500 mx-auto mb-4" />
              <h2 className="text-xl font-bold mb-2">Credential Not Found</h2>
              <p className="text-gray-600 mb-4">The credential token "{token}" could not be verified.</p>
              <Button asChild variant="outline" className="glass border-white/20">
                <Link href="/">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Search
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30">
      <Navbar />

      <div className="pt-16">
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between mb-8"
          >
            <div className="flex items-center space-x-4">
              <Button variant="outline" asChild className="glass border-white/20">
                <Link href="/">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Search
                </Link>
              </Button>
              <Badge className="glass px-4 py-2 border-green-200 bg-green-50 text-green-800">
                <CheckCircle className="w-4 h-4 mr-2" />
                Verified Credential
              </Badge>
            </div>
            <div className="text-right">
              <h1 className="text-2xl font-bold gradient-text">dResume</h1>
              <p className="text-sm text-gray-600">Credential Verification</p>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Credential Header */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                <Card className="glass-card border-white/20">
                  <CardContent className="p-8">
                    <div className="flex items-start space-x-4">
                      <div className="p-3 bg-blue-100 rounded-lg">
                        <Shield className="h-8 w-8 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <h1 className="text-3xl font-bold mb-2">{credential.title}</h1>
                        <p className="text-lg text-gray-600 mb-4">{credential.type}</p>
                        <Badge className="glass px-3 py-1 border-green-200 bg-green-50 text-green-800">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Issued
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Supporting Document */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                <Card className="glass-card border-white/20">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <FileText className="mr-2 h-5 w-5" />
                      Supporting Document
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-red-100 rounded">
                          <FileText className="h-6 w-6 text-red-600" />
                        </div>
                        <div>
                          <p className="font-medium">{credential.document.type}</p>
                          <p className="text-sm text-gray-600">{credential.document.size}</p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" className="glass border-white/20">
                          <Download className="mr-2 h-4 w-4" />
                          Download
                        </Button>
                        <Button variant="outline" size="sm" className="glass border-white/20">
                          <Maximize2 className="mr-2 h-4 w-4" />
                          Full Size
                        </Button>
                      </div>
                    </div>

                    {/* Document Preview */}
                    <div className="bg-gray-100 rounded-lg p-8 text-center">
                      <div className="bg-white rounded shadow-lg p-8 max-w-md mx-auto">
                        <div className="text-center space-y-4">
                          <h3 className="text-xl font-bold">Certificate Document</h3>
                          <p className="text-lg font-semibold">{credential.title}</p>
                          <p className="text-gray-600">{credential.issuer.name}</p>
                          <p className="text-sm">Awarded to: {credential.recipient.name}</p>
                          <p className="text-sm">Date: {credential.issueDate}</p>
                          <div className="mt-6 p-2 bg-green-50 rounded">
                            <p className="text-green-800 font-medium text-sm">VERIFIED</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Description and Details */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                <Card className="glass-card border-white/20">
                  <CardHeader>
                    <CardTitle>Description</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <p className="text-gray-700 leading-relaxed">{credential.description}</p>

                    <div>
                      <h4 className="font-semibold mb-2">Grade/Achievement</h4>
                      <p className="text-gray-700">{credential.grade}</p>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-3">Skills & Competencies</h4>
                      <div className="flex flex-wrap gap-2">
                        {credential.skills.map((skill: string, index: number) => (
                          <Badge key={index} variant="secondary" className="glass border-white/20">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="text-sm text-gray-500">
                      <p>Issue Date: {credential.issueDate}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Blockchain Verification */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                <Card className="glass-card border-white/20">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Shield className="mr-2 h-5 w-5" />
                      Blockchain Verification
                    </CardTitle>
                    <CardDescription>
                      This credential is permanently recorded on the Internet Computer blockchain
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-600">Token ID</label>
                        <div className="flex items-center space-x-2 mt-1">
                          <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">
                            {credential.blockchain.tokenId}
                          </code>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleCopyHash(credential.blockchain.tokenId)}
                            className="p-1"
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>

                      <div>
                        <label className="text-sm font-medium text-gray-600">Blockchain Hash</label>
                        <div className="flex items-center space-x-2 mt-1">
                          <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono truncate">
                            {credential.blockchain.blockchainHash}
                          </code>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleCopyHash(credential.blockchain.blockchainHash)}
                            className="p-1"
                          >
                            <ExternalLink className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>

                      <div>
                        <label className="text-sm font-medium text-gray-600">IPFS Hash</label>
                        <div className="flex items-center space-x-2 mt-1">
                          <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono truncate">
                            {credential.blockchain.ipfsHash}
                          </code>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleCopyHash(credential.blockchain.ipfsHash)}
                            className="p-1"
                          >
                            <ExternalLink className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">{credential.blockchain.verifications}</div>
                        <div className="text-sm text-gray-600">Verifications</div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm font-medium">Last Verified</div>
                        <div className="text-sm text-gray-600">{credential.blockchain.lastVerified}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Recipient Info */}
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
                <Card className="glass-card border-white/20">
                  <CardHeader>
                    <CardTitle className="flex items-center text-sm">
                      <User className="mr-2 h-4 w-4" />
                      Recipient
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={credential.recipient.avatar || "/placeholder.svg"} />
                        <AvatarFallback>
                          {credential.recipient.name
                            .split(" ")
                            .map((n: string) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold">{credential.recipient.name}</p>
                        <p className="text-sm text-gray-600">{credential.recipient.email}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Issuer Info */}
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
                <Card className="glass-card border-white/20">
                  <CardHeader>
                    <CardTitle className="flex items-center text-sm">
                      <Building className="mr-2 h-4 w-4" />
                      Issuer
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={credential.issuer.logo || "/placeholder.svg"} />
                          <AvatarFallback>MIT</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold text-sm">{credential.issuer.name}</p>
                          <p className="text-xs text-gray-600">{credential.issuer.type}</p>
                        </div>
                      </div>
                      <Badge className="glass px-2 py-1 border-green-200 bg-green-50 text-green-800 text-xs">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Verified Issuer
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Share Credential */}
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
                <Card className="glass-card border-white/20">
                  <CardHeader>
                    <CardTitle className="flex items-center text-sm">
                      <Share2 className="mr-2 h-4 w-4" />
                      Share Credential
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button
                      onClick={handleCopyLink}
                      className="w-full glass-card bg-gray-900 text-white border-0 hover-glow"
                    >
                      <Copy className="mr-2 h-4 w-4" />
                      {copied ? "Copied!" : "Copy Link"}
                    </Button>
                    <Button variant="outline" className="w-full glass border-white/20">
                      <Linkedin className="mr-2 h-4 w-4" />
                      Add to LinkedIn
                    </Button>
                    <Button variant="outline" className="w-full glass border-white/20">
                      <Shield className="mr-2 h-4 w-4" />
                      Verify Credential
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
