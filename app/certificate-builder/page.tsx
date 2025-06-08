"use client"

import { useState, useEffect, useRef, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Download,
  Edit,
  Eye,
  FileText,
  Award,
  GraduationCap,
  Briefcase,
  Trophy,
  Star,
  Palette,
  Type,
  Image as ImageIcon,
  Save,
  RefreshCw,
} from "lucide-react"
import { CertificatePreview } from "@/components/certificate/certificate-preview"
import { CertificateForm } from "@/components/certificate/certificate-form"

const templates = {
  professional: {
    name: "Professional Certificate",
    icon: Award,
    color: "bg-blue-100 text-blue-700",
    defaultData: {
      title: "Certificate of Achievement",
      recipientName: "",
      organizationName: "",
      description: "This is to certify that the above named has successfully completed",
      courseName: "",
      date: new Date().toISOString().split('T')[0],
      tokenId: "",
      signatoryName: "",
      signatoryTitle: "",
    }
  },
  academic: {
    name: "Academic Achievement",
    icon: GraduationCap,
    color: "bg-green-100 text-green-700",
    defaultData: {
      title: "Academic Excellence Certificate",
      recipientName: "",
      organizationName: "",
      description: "This certifies that the student has demonstrated exceptional academic performance in",
      courseName: "",
      date: new Date().toISOString().split('T')[0],
      tokenId: "",
      signatoryName: "",
      signatoryTitle: "Dean of Academic Affairs",
    }
  },
  corporate: {
    name: "Corporate Training",
    icon: Briefcase,
    color: "bg-purple-100 text-purple-700",
    defaultData: {
      title: "Training Completion Certificate",
      recipientName: "",
      organizationName: "",
      description: "This certifies successful completion of the training program",
      courseName: "",
      date: new Date().toISOString().split('T')[0],
      tokenId: "",
      signatoryName: "",
      signatoryTitle: "Training Director",
    }
  },
  achievement: {
    name: "Achievement Award",
    icon: Trophy,
    color: "bg-yellow-100 text-yellow-700",
    defaultData: {
      title: "Achievement Award",
      recipientName: "",
      organizationName: "",
      description: "In recognition of outstanding achievement and dedication in",
      courseName: "",
      date: new Date().toISOString().split('T')[0],
      tokenId: "",
      signatoryName: "",
      signatoryTitle: "Director",
    }
  },
  excellence: {
    name: "Excellence Certificate",
    icon: Star,
    color: "bg-red-100 text-red-700",
    defaultData: {
      title: "Certificate of Excellence",
      recipientName: "",
      organizationName: "",
      description: "This certificate is awarded in recognition of excellence in",
      courseName: "",
      date: new Date().toISOString().split('T')[0],
      tokenId: "",
      signatoryName: "",
      signatoryTitle: "Chief Executive Officer",
    }
  }
}

function CertificateBuilderContent() {
  const searchParams = useSearchParams()
  const templateId = searchParams.get('template') || 'professional'
  const [selectedTemplate, setSelectedTemplate] = useState(templateId)
  const [certificateData, setCertificateData] = useState(templates[templateId as keyof typeof templates]?.defaultData || templates.professional.defaultData)
  const [isEditing, setIsEditing] = useState(true)
  const [isSaving, setSaving] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)
  const previewRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const template = templates[selectedTemplate as keyof typeof templates]
    if (template) {
      setCertificateData(template.defaultData)
    }
  }, [selectedTemplate])

  const handleDataChange = (field: string, value: string) => {
    setCertificateData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleTemplateChange = (templateId: string) => {
    setSelectedTemplate(templateId)
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      // TODO: Implement saving to backend
      await new Promise(resolve => setTimeout(resolve, 1000))
      console.log('Saved certificate data:', certificateData)
    } catch (error) {
      console.error('Error saving certificate:', error)
    } finally {
      setSaving(false)
    }
  }

  const handleDownload = async () => {
    setIsDownloading(true)
    try {
      // TODO: Implement certificate download as PNG
      await new Promise(resolve => setTimeout(resolve, 2000))
      console.log('Downloading certificate...')
    } catch (error) {
      console.error('Error downloading certificate:', error)
    } finally {
      setIsDownloading(false)
    }
  }

  const currentTemplate = templates[selectedTemplate as keyof typeof templates] || templates.professional
  const TemplateIcon = currentTemplate.icon

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <FileText className="h-6 w-6 text-green-600" />
              <h1 className="text-xl font-semibold text-gray-900">Certificate Builder</h1>
              <Badge variant="secondary" className={currentTemplate.color}>
                <TemplateIcon className="h-3 w-3 mr-1" />
                {currentTemplate.name}
              </Badge>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                onClick={() => setIsEditing(!isEditing)}
                size="sm"
              >
                {isEditing ? (
                  <>
                    <Eye className="h-4 w-4 mr-2" />
                    Preview
                  </>
                ) : (
                  <>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                onClick={handleSave}
                disabled={isSaving}
                size="sm"
              >
                {isSaving ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save
                  </>
                )}
              </Button>
              <Button
                onClick={handleDownload}
                disabled={isDownloading}
                size="sm"
                className="bg-green-600 hover:bg-green-700"
              >
                {isDownloading ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
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
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Panel */}
          {isEditing && (
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Edit className="h-5 w-5" />
                    <span>Certificate Details</span>
                  </CardTitle>
                  <CardDescription>
                    Customize your certificate content and design
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <CertificateForm
                    data={certificateData}
                    onChange={handleDataChange}
                    selectedTemplate={selectedTemplate}
                    onTemplateChange={handleTemplateChange}
                    templates={templates}
                  />
                </CardContent>
              </Card>
            </div>
          )}

          {/* Preview Panel */}
          <div className={isEditing ? "lg:col-span-2" : "lg:col-span-3"}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Eye className="h-5 w-5" />
                  <span>Certificate Preview</span>
                </CardTitle>
                <CardDescription>
                  Live preview of your certificate
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div ref={previewRef} className="bg-white">
                  <CertificatePreview
                    template={selectedTemplate}
                    data={certificateData}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Instructions */}
        <Card className="mt-8">
          <CardContent className="p-6">
            <div className="flex items-start space-x-3">
              <FileText className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-gray-700">
                <p className="font-medium mb-2">How to use the Certificate Builder:</p>
                <ul className="space-y-1 text-xs">
                  <li>• Fill in the certificate details in the form panel</li>
                  <li>• Switch between templates to find the perfect design</li>
                  <li>• Use the Preview/Edit toggle to see your changes</li>
                  <li>• Save your work to continue editing later</li>
                  <li>• Download as PNG when you're satisfied with the result</li>
                  <li>• You can always come back to edit and re-download</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function CertificateBuilderPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-gray-400" />
          <p className="text-gray-600">Loading certificate builder...</p>
        </div>
      </div>
    }>
      <CertificateBuilderContent />
    </Suspense>
  )
}
