"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Award, GraduationCap, Briefcase, Trophy, Star, Palette } from "lucide-react"

interface CertificateFormProps {
  data: any
  onChange: (field: string, value: string) => void
  selectedTemplate: string
  onTemplateChange: (templateId: string) => void
  templates: any
}

export function CertificateForm({
  data,
  onChange,
  selectedTemplate,
  onTemplateChange,
  templates
}: CertificateFormProps) {
  return (
    <div className="space-y-6">
      {/* Template Selection */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Template</Label>
        <Select value={selectedTemplate} onValueChange={onTemplateChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select a template" />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(templates).map(([id, template]: [string, any]) => {
              const IconComponent = template.icon
              return (
                <SelectItem key={id} value={id}>
                  <div className="flex items-center space-x-2">
                    <IconComponent className="h-4 w-4" />
                    <span>{template.name}</span>
                  </div>
                </SelectItem>
              )
            })}
          </SelectContent>
        </Select>
      </div>

      <Separator />

      {/* Certificate Content */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-gray-900">Certificate Content</h3>
        
        <div className="space-y-3">
          <div>
            <Label htmlFor="title">Certificate Title</Label>
            <Input
              id="title"
              value={data.title}
              onChange={(e) => onChange('title', e.target.value)}
              placeholder="e.g., Certificate of Achievement"
            />
          </div>

          <div>
            <Label htmlFor="recipientName">Recipient Name</Label>
            <Input
              id="recipientName"
              value={data.recipientName}
              onChange={(e) => onChange('recipientName', e.target.value)}
              placeholder="e.g., John Doe"
            />
          </div>

          <div>
            <Label htmlFor="organizationName">Organization Name</Label>
            <Input
              id="organizationName"
              value={data.organizationName}
              onChange={(e) => onChange('organizationName', e.target.value)}
              placeholder="e.g., Your Organization"
            />
          </div>

          <div>
            <Label htmlFor="courseName">Course/Program Name</Label>
            <Input
              id="courseName"
              value={data.courseName}
              onChange={(e) => onChange('courseName', e.target.value)}
              placeholder="e.g., Advanced Web Development"
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={data.description}
              onChange={(e) => onChange('description', e.target.value)}
              placeholder="Brief description of the achievement"
              rows={3}
            />
          </div>
        </div>
      </div>

      <Separator />

      {/* Certificate Details */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-gray-900">Certificate Details</h3>
        
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="date">Date Issued</Label>
            <Input
              id="date"
              type="date"
              value={data.date}
              onChange={(e) => onChange('date', e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="tokenId">Token ID (Optional)</Label>
            <Input
              id="tokenId"
              value={data.tokenId}
              onChange={(e) => onChange('tokenId', e.target.value)}
              placeholder="e.g., CS-2025-001"
            />
          </div>
        </div>
      </div>

      <Separator />

      {/* Signatory Information */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-gray-900">Signatory Information</h3>
        
        <div className="space-y-3">
          <div>
            <Label htmlFor="signatoryName">Signatory Name</Label>
            <Input
              id="signatoryName"
              value={data.signatoryName}
              onChange={(e) => onChange('signatoryName', e.target.value)}
              placeholder="e.g., Dr. Jane Smith"
            />
          </div>

          <div>
            <Label htmlFor="signatoryTitle">Signatory Title</Label>
            <Input
              id="signatoryTitle"
              value={data.signatoryTitle}
              onChange={(e) => onChange('signatoryTitle', e.target.value)}
              placeholder="e.g., Director of Education"
            />
          </div>
        </div>
      </div>

      {/* Template Info */}
      <Card className="bg-gray-50">
        <CardContent className="p-4">
          <div className="flex items-start space-x-2">
            <Palette className="h-4 w-4 text-gray-600 mt-0.5 flex-shrink-0" />
            <div className="text-xs text-gray-600">
              <p className="font-medium mb-1">Template Features:</p>
              <ul className="space-y-0.5">
                <li>• Professional layout and typography</li>
                <li>• Customizable colors and branding</li>
                <li>• High-resolution output (300 DPI)</li>
                <li>• Print-ready format</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
