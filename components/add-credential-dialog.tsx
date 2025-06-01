"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Award, Briefcase, GraduationCap, Heart, Code, Trophy, Upload, Plus, Users, Loader2 } from "lucide-react"
import { useCredentials } from "@/hooks/useIC"
import { useAuth } from "@/contexts/auth-context"

interface AddCredentialDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AddCredentialDialog({ open, onOpenChange }: AddCredentialDialogProps) {
  const [selectedType, setSelectedType] = useState("")
  const [formData, setFormData] = useState({
    title: "",
    issuer: "",
    description: "",
    date: "",
    verifierEmail: "",
    attachments: [] as File[],
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const { createCredential } = useCredentials()
  const { principal } = useAuth()

  const credentialTypes = [
    {
      id: "certificate",
      name: "Certificate & Courses",
      description: "Professional certifications, online courses, training programs",
      icon: Award,
      examples: ["AWS Certification", "Google Analytics", "Coursera Course"],
    },
    {
      id: "work",
      name: "Work Experience",
      description: "Employment history, internships, contract work",
      icon: Briefcase,
      examples: ["Software Engineer at TechCorp", "Marketing Intern", "Freelance Designer"],
    },
    {
      id: "education",
      name: "Formal Education",
      description: "Degrees, diplomas, academic achievements",
      icon: GraduationCap,
      examples: ["Bachelor's Degree", "Master's in CS", "Dean's List"],
    },
    {
      id: "volunteer",
      name: "Volunteering & NGOs",
      description: "Community service, non-profit work, social impact",
      icon: Heart,
      examples: ["Coding Mentor", "Food Bank Volunteer", "Environmental Cleanup"],
    },
    {
      id: "project",
      name: "Personal Projects",
      description: "Side projects, open source contributions, portfolios",
      icon: Code,
      examples: ["E-commerce App", "Open Source Library", "Mobile Game"],
    },
    {
      id: "hackathon",
      name: "Competitions & Awards",
      description: "Hackathons, contests, recognition, achievements",
      icon: Trophy,
      examples: ["Hackathon Winner", "Innovation Award", "Competition Finalist"],
    },
    {
      id: "soft-skills",
      name: "Soft Skills & Peer Reviews",
      description: "Leadership, communication, teamwork assessments",
      icon: Users,
      examples: ["Team Leadership", "Public Speaking", "Project Management"],
    },
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!principal) {
      console.error('Not authenticated')
      return
    }

    setIsSubmitting(true)
    try {
      // Map frontend types to backend types
      const credentialTypeMap: { [key: string]: any } = {
        certificate: { Professional: null },
        work: { Professional: null },
        education: { Academic: null },
        volunteer: { Community: null },
        project: { Professional: null },
        hackathon: { Professional: null },
      }

      const credentialType = credentialTypeMap[selectedType] || { Professional: null }
      
      // Create credential via ICP backend
      const result = await createCredential(
        credentialType,
        formData.title,
        formData.description,
        formData.verifierEmail,
        `${formData.title} Recipient`, // recipient name
        {}, // metadata
        [], // document hash (empty for now)
        [] // expires at (optional)
      )

      if (result) {
        console.log("Credential created successfully:", result)
        onOpenChange(false)
        // Reset form
        setSelectedType("")
        setFormData({
          title: "",
          issuer: "",
          description: "",
          date: "",
          verifierEmail: "",
          attachments: [],
        })
      }
    } catch (error) {
      console.error('Failed to create credential:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const selectedTypeData = credentialTypes.find((type) => type.id === selectedType)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Credential</DialogTitle>
          <DialogDescription>
            Add a new verifiable credential to your dResume. Choose the type and provide details.
          </DialogDescription>
        </DialogHeader>

        <Tabs value={selectedType ? "form" : "type"} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="type">1. Choose Type</TabsTrigger>
            <TabsTrigger value="form" disabled={!selectedType}>
              2. Add Details
            </TabsTrigger>
          </TabsList>

          <TabsContent value="type" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              {credentialTypes.map((type) => {
                const IconComponent = type.icon
                return (
                  <Card
                    key={type.id}
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      selectedType === type.id ? "ring-2 ring-primary" : ""
                    }`}
                    onClick={() => setSelectedType(type.id)}
                  >
                    <CardHeader>
                      <CardTitle className="flex items-center text-sm">
                        <IconComponent className="h-5 w-5 mr-2 text-primary" />
                        {type.name}
                      </CardTitle>
                      <CardDescription className="text-xs">{type.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="text-xs font-medium">Examples:</div>
                        <div className="flex flex-wrap gap-1">
                          {type.examples.map((example, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {example}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
            {selectedType && (
              <div className="flex justify-end">
                <Button onClick={() => setSelectedType(selectedType)}>Continue with {selectedTypeData?.name}</Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="form" className="space-y-4">
            {selectedTypeData && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-lg">
                    <selectedTypeData.icon className="h-5 w-5 mr-2 text-primary" />
                    {selectedTypeData.name}
                  </CardTitle>
                  <CardDescription>{selectedTypeData.description}</CardDescription>
                </CardHeader>
              </Card>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    placeholder="e.g., AWS Solutions Architect"
                    value={formData.title}
                    onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="issuer">Issuer/Organization *</Label>
                  <Input
                    id="issuer"
                    placeholder="e.g., Amazon Web Services"
                    value={formData.issuer}
                    onChange={(e) => setFormData((prev) => ({ ...prev, issuer: e.target.value }))}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe your achievement, role, or what you learned..."
                  value={formData.description}
                  onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                  rows={3}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="date">Date Achieved/Completed *</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData((prev) => ({ ...prev, date: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="verifierEmail">Verifier Email (Optional)</Label>
                  <Input
                    id="verifierEmail"
                    type="email"
                    placeholder="verifier@organization.com"
                    value={formData.verifierEmail}
                    onChange={(e) => setFormData((prev) => ({ ...prev, verifierEmail: e.target.value }))}
                  />
                  <p className="text-xs text-muted-foreground">We'll send a verification request to this email</p>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Attachments (Optional)</Label>
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                  <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground mb-2">
                    Upload certificates, screenshots, or supporting documents
                  </p>
                  <Button type="button" variant="outline" size="sm">
                    Choose Files
                  </Button>
                </div>
              </div>

              <Card className="bg-muted/50">
                <CardContent className="p-4">
                  <h4 className="font-medium mb-2">What happens next?</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Your credential will be stored in your personal ICP canister</li>
                    <li>• If you provided a verifier email, we'll send them a verification request</li>
                    <li>• Once verified, your credential will be cryptographically signed</li>
                    <li>• You can then share it on your public profile</li>
                  </ul>
                </CardContent>
              </Card>

              <DialogFooter className="flex gap-2">
                <Button type="button" variant="outline" onClick={() => setSelectedType("")}>
                  Back
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Credential
                    </>
                  )}
                </Button>
              </DialogFooter>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
