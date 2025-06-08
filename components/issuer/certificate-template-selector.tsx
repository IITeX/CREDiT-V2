"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ExternalLink, FileText, Award, GraduationCap, Briefcase, Trophy, Star } from "lucide-react"

interface CertificateTemplateSelectorProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const certificateTemplates = [
  {
    id: "professional",
    name: "Professional Certificate",
    description: "Clean and modern design for professional certifications",
    icon: Award,
    color: "bg-blue-100 text-blue-700 border-blue-200",
    preview: "/templates/professional-preview.png",
    category: "Professional"
  },
  {
    id: "academic",
    name: "Academic Achievement",
    description: "Traditional academic style for educational institutions",
    icon: GraduationCap,
    color: "bg-green-100 text-green-700 border-green-200",
    preview: "/templates/academic-preview.png",
    category: "Education"
  },
  {
    id: "corporate",
    name: "Corporate Training",
    description: "Business-focused design for corporate training programs",
    icon: Briefcase,
    color: "bg-purple-100 text-purple-700 border-purple-200",
    preview: "/templates/corporate-preview.png",
    category: "Corporate"
  },
  {
    id: "achievement",
    name: "Achievement Award",
    description: "Celebratory design for special achievements and awards",
    icon: Trophy,
    color: "bg-yellow-100 text-yellow-700 border-yellow-200",
    preview: "/templates/achievement-preview.png",
    category: "Achievement"
  },
  {
    id: "excellence",
    name: "Excellence Certificate",
    description: "Premium design for excellence and outstanding performance",
    icon: Star,
    color: "bg-red-100 text-red-700 border-red-200",
    preview: "/templates/excellence-preview.png",
    category: "Excellence"
  }
]

export function CertificateTemplateSelector({
  open,
  onOpenChange,
}: CertificateTemplateSelectorProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)

  const handleTemplateSelect = (templateId: string) => {
    // Open in new tab for certificate creation
    const url = `/certificate-builder?template=${templateId}`
    window.open(url, '_blank')
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <FileText className="h-5 w-5 text-green-600" />
            <span>Choose Certificate Template</span>
          </DialogTitle>
          <DialogDescription>
            Select a professional template to create your certificate. You can customize it with your own content and branding.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Template Grid */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {certificateTemplates.map((template) => {
              const IconComponent = template.icon
              return (
                <Card
                  key={template.id}
                  className={`cursor-pointer transition-all duration-200 hover:shadow-lg border-2 ${
                    selectedTemplate === template.id
                      ? 'border-green-500 ring-2 ring-green-200'
                      : 'border-gray-200 hover:border-green-300'
                  }`}
                  onClick={() => setSelectedTemplate(template.id)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${template.color}`}>
                        <IconComponent className="w-5 h-5" />
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {template.category}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg">{template.name}</CardTitle>
                    <CardDescription className="text-sm">
                      {template.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    {/* Template Preview Placeholder */}
                    <div className="aspect-[4/3] bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center mb-3">
                      <div className="text-center">
                        <FileText className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-xs text-gray-500">Template Preview</p>
                      </div>
                    </div>
                    <Button
                      variant={selectedTemplate === template.id ? "default" : "outline"}
                      size="sm"
                      className="w-full"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleTemplateSelect(template.id)
                      }}
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Use Template
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Information */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start space-x-2">
              <FileText className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-2">Certificate Builder Features:</p>
                <ul className="space-y-1 text-xs">
                  <li>• Customize text, colors, and layout</li>
                  <li>• Add your organization logo and branding</li>
                  <li>• Preview before downloading</li>
                  <li>• Download as high-quality PNG</li>
                  <li>• Edit and re-download anytime</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex justify-between items-center pt-4 border-t">
            <div className="text-sm text-gray-600">
              Need a custom template? <a href="#" className="text-green-600 hover:underline">Contact support</a>
            </div>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
