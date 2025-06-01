"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import {
  Shield,
  ExternalLink,
  Calendar,
  CheckCircle,
  Award,
  Briefcase,
  GraduationCap,
  Code,
  Trophy,
  MapPin,
  Mail,
  Globe,
  Github,
  Linkedin,
} from "lucide-react"

// Add these imports at the top
import { useAuth } from "@/contexts/auth-context"

// Update the profile data to use real authentication:
function ProfileContent() {
  const { principal, isAuthenticated } = useAuth()

  const profileData = {
    name: "John Doe",
    title: "Full Stack Developer",
    location: "San Francisco, CA",
    email: "john.doe@example.com",
    website: "johndoe.dev",
    github: "johndoe",
    linkedin: "johndoe",
    bio: "Passionate full-stack developer with 5+ years of experience building scalable web applications. Specialized in React, Node.js, and cloud architecture. Active contributor to open-source projects and mentor in the developer community.",
    icpIdentity: principal ? principal.toString() : "Not connected",
  }

  const publicCredentials = [
    {
      id: 1,
      type: "certificate",
      title: "AWS Solutions Architect",
      issuer: "Amazon Web Services",
      date: "2024-01-15",
      status: "verified",
      verifier: "AWS Training",
      description: "Professional certification for cloud architecture",
      icon: Award,
      verificationHash: "0x1a2b3c4d5e6f7890abcdef1234567890",
    },
    {
      id: 2,
      type: "work",
      title: "Senior Frontend Developer",
      issuer: "TechCorp Inc.",
      date: "2023-06-01",
      status: "verified",
      verifier: "HR Manager - Sarah Johnson",
      description: "Led frontend development team for 18 months",
      icon: Briefcase,
      verificationHash: "0x2b3c4d5e6f7890abcdef1234567890ab",
    },
    {
      id: 3,
      type: "education",
      title: "Bachelor of Computer Science",
      issuer: "State University",
      date: "2022-05-20",
      status: "verified",
      verifier: "University Registrar",
      description: "Graduated Magna Cum Laude, GPA: 3.8",
      icon: GraduationCap,
      verificationHash: "0x3c4d5e6f7890abcdef1234567890abcd",
    },
    {
      id: 4,
      type: "project",
      title: "E-commerce Platform",
      issuer: "Personal Project",
      date: "2024-02-28",
      status: "self-verified",
      verifier: "Self-verified",
      description: "Full-stack e-commerce platform with 1000+ users",
      icon: Code,
      verificationHash: "0x4d5e6f7890abcdef1234567890abcdef",
    },
    {
      id: 5,
      type: "hackathon",
      title: "Best Innovation Award",
      issuer: "TechHack 2024",
      date: "2024-03-15",
      status: "verified",
      verifier: "Event Organizers",
      description: "1st place in sustainability category",
      icon: Trophy,
      verificationHash: "0x5e6f7890abcdef1234567890abcdef12",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "verified":
        return "bg-green-100 text-green-800 border-green-200"
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "self-verified":
        return "bg-blue-100 text-blue-800 border-blue-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Profile Header */}
      <Card>
        <CardContent className="p-8">
          <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
            <Avatar className="h-24 w-24">
              <AvatarImage src="/placeholder.svg?height=96&width=96" />
              <AvatarFallback className="text-2xl">JD</AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-2">
              <div className="flex items-center space-x-2">
                <h1 className="text-3xl font-bold">{profileData.name}</h1>
                <Badge variant="outline" className="text-xs">
                  <Shield className="h-3 w-3 mr-1" />
                  Verified on ICP
                </Badge>
              </div>
              <p className="text-xl text-muted-foreground">{profileData.title}</p>
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-1" />
                  {profileData.location}
                </div>
                <div className="flex items-center">
                  <Mail className="h-4 w-4 mr-1" />
                  {profileData.email}
                </div>
                <div className="flex items-center">
                  <Globe className="h-4 w-4 mr-1" />
                  {profileData.website}
                </div>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" asChild>
                  <Link href={`https://github.com/${profileData.github}`}>
                    <Github className="h-4 w-4 mr-2" />
                    GitHub
                  </Link>
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <Link href={`https://linkedin.com/in/${profileData.linkedin}`}>
                    <Linkedin className="h-4 w-4 mr-2" />
                    LinkedIn
                  </Link>
                </Button>
              </div>
            </div>
          </div>
          <Separator className="my-6" />
          <div>
            <h3 className="font-semibold mb-2">About</h3>
            <p className="text-muted-foreground">{profileData.bio}</p>
          </div>
          <Separator className="my-6" />
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div>ICP Identity: {profileData.icpIdentity}</div>
            <div>Profile verified on Internet Computer Protocol</div>
          </div>
        </CardContent>
      </Card>

      {/* Credentials Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shield className="h-5 w-5 mr-2" />
            Verified Credentials
          </CardTitle>
          <CardDescription>All credentials are cryptographically signed and stored on-chain</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {publicCredentials.map((credential) => {
            const IconComponent = credential.icon
            return (
              <Card key={credential.id} className="border-l-4 border-l-primary">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <IconComponent className="h-6 w-6 text-primary" />
                      </div>
                      <div className="space-y-2">
                        <h3 className="font-semibold text-lg">{credential.title}</h3>
                        <p className="text-muted-foreground font-medium">{credential.issuer}</p>
                        <p className="text-sm">{credential.description}</p>
                        <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                          <div className="flex items-center">
                            <Calendar className="h-3 w-3 mr-1" />
                            {new Date(credential.date).toLocaleDateString()}
                          </div>
                          <div>Verified by: {credential.verifier}</div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge className={getStatusColor(credential.status)}>
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Verified
                          </Badge>
                          <Button variant="ghost" size="sm" className="h-6 text-xs">
                            <ExternalLink className="h-3 w-3 mr-1" />
                            View on Chain
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <Separator className="my-4" />
                  <div className="bg-muted/50 p-3 rounded-lg">
                    <div className="text-xs text-muted-foreground mb-1">Verification Hash:</div>
                    <div className="font-mono text-xs break-all">{credential.verificationHash}</div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </CardContent>
      </Card>

      {/* Verification Notice */}
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="p-6">
          <div className="flex items-center space-x-3">
            <Shield className="h-8 w-8 text-primary" />
            <div>
              <h3 className="font-semibold">Tamper-Proof Verification</h3>
              <p className="text-sm text-muted-foreground">
                All credentials on this profile are cryptographically signed and stored on the Internet Computer
                Protocol. Click "View on Chain" to verify authenticity directly on the blockchain.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Wrap the main content:
export default function PublicProfilePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header remains the same */}
      <header className="px-4 lg:px-6 h-14 flex items-center border-b">
        <Link className="flex items-center justify-center" href="/">
          <Shield className="h-6 w-6 text-primary" />
          <span className="ml-2 text-xl font-bold">dResume</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="/">
            Home
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="/dashboard">
            Dashboard
          </Link>
        </nav>
      </header>
      <main className="flex-1 p-6 bg-muted/30">
        <ProfileContent />
      </main>
      {/* Footer remains the same */}
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-muted-foreground">© 2024 dResume. Powered by Internet Computer Protocol.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Verify Credentials
          </Link>
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            About ICP
          </Link>
        </nav>
      </footer>
    </div>
  )
}
