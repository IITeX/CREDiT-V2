"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { DocumentUpload } from "./document-upload"
import { Building, Globe, FileText, ArrowLeft } from "lucide-react"

interface OrganizationFormProps {
  role: string
  onSubmit: (data: any) => void
  onBack: () => void
}

export function OrganizationForm({ role, onSubmit, onBack }: OrganizationFormProps) {
  const [formData, setFormData] = useState({
    organizationName: "",
    organizationType: "",
    website: "",
    description: "",
    documents: [] as File[],
  })

  const organizationTypes = [
    "University/College",
    "High School",
    "Training Institute",
    "Technology Company",
    "Healthcare Organization",
    "Financial Services",
    "Government Agency",
    "Non-Profit Organization",
    "Consulting Firm",
    "Manufacturing Company",
    "Other",
  ]

  const verifierTypes = [
    "Background Check Service",
    "Professional Certification Body",
    "Educational Verification Service",
    "Employment Verification Service",
    "Skills Assessment Platform",
    "Other Verification Service",
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const types = role === "verifier" ? verifierTypes : organizationTypes

  return (
    <Card className="w-full max-w-2xl mx-auto bg-white/90 backdrop-blur-lg border border-green-200 shadow-xl">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
          <Building className="h-6 w-6 text-green-600" />
        </div>
        <CardTitle className="text-2xl font-bold text-green-800">
          {role === "verifier" ? "Verifier Information" : "Organization Details"}
        </CardTitle>
        <CardDescription className="text-green-600">
          Tell us about your {role === "verifier" ? "verification service" : "organization"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="organizationName" className="text-green-700">
              {role === "verifier" ? "Service Name" : "Organization Name"} *
            </Label>
            <div className="relative">
              <Building className="absolute left-3 top-3 h-4 w-4 text-green-500" />
              <Input
                id="organizationName"
                type="text"
                placeholder={role === "verifier" ? "Enter your service name" : "Enter organization name"}
                value={formData.organizationName}
                onChange={(e) => setFormData((prev) => ({ ...prev, organizationName: e.target.value }))}
                className="pl-10 border-green-200 focus:border-green-500 focus:ring-green-500"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="organizationType" className="text-green-700">
              {role === "verifier" ? "Service Type" : "Organization Type"} *
            </Label>
            <Select
              value={formData.organizationType}
              onValueChange={(value) => setFormData((prev) => ({ ...prev, organizationType: value }))}
              required
            >
              <SelectTrigger className="border-green-200 focus:border-green-500 focus:ring-green-500">
                <SelectValue placeholder={`Select ${role === "verifier" ? "service" : "organization"} type`} />
              </SelectTrigger>
              <SelectContent>
                {types.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="website" className="text-green-700">
              Website
            </Label>
            <div className="relative">
              <Globe className="absolute left-3 top-3 h-4 w-4 text-green-500" />
              <Input
                id="website"
                type="url"
                placeholder="https://your-website.com"
                value={formData.website}
                onChange={(e) => setFormData((prev) => ({ ...prev, website: e.target.value }))}
                className="pl-10 border-green-200 focus:border-green-500 focus:ring-green-500"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-green-700">
              Description
            </Label>
            <Textarea
              id="description"
              placeholder={`Describe your ${role === "verifier" ? "verification services" : "organization and what you do"}`}
              value={formData.description}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
              className="border-green-200 focus:border-green-500 focus:ring-green-500"
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label className="text-green-700">Verification Documents *</Label>
            <DocumentUpload
              onFilesChange={(files) => setFormData((prev) => ({ ...prev, documents: files }))}
              acceptedTypes={[".pdf", ".jpg", ".jpeg", ".png"]}
              maxFiles={5}
              maxSize={10 * 1024 * 1024} // 10MB
            />
            <p className="text-xs text-green-600">
              Upload official documents to verify your {role === "verifier" ? "service" : "organization"}
              (business license, accreditation certificates, etc.)
            </p>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <FileText className="h-5 w-5 text-green-600 mt-0.5" />
              <div className="text-sm text-green-800">
                <p className="font-medium mb-1">Verification Process</p>
                <ul className="space-y-1 text-green-700">
                  <li>• Our team will review your information and documents</li>
                  <li>• Verification typically takes 24-48 hours</li>
                  <li>• You'll receive an email notification once approved</li>
                  <li>• Additional information may be requested if needed</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="flex space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={onBack}
              className="flex-1 border-green-200 text-green-700 hover:bg-green-50"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-green-600 hover:bg-green-700 text-white"
              disabled={!formData.organizationName || !formData.organizationType || formData.documents.length === 0}
            >
              Continue
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
