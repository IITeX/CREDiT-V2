"use client"

import { useEffect, useState } from "react"
import { previewCertificate, type CertificateData } from "@/lib/certificate-generator"

interface CertificatePreviewProps {
  template: string
  data: any
}

export function CertificatePreview({ template, data }: CertificatePreviewProps) {
  const [previewUrl, setPreviewUrl] = useState<string>('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string>('')

  useEffect(() => {
    const generatePreview = async () => {
      setIsLoading(true)
      setError('')

      try {
        // Convert data to CertificateData format
        const certificateData: CertificateData = {
          tokenId: data.tokenId || `CERT-${Date.now()}`,
          title: data.title || 'Certificate Title',
          recipientName: data.recipientName || 'Recipient Name',
          issuerName: data.organizationName || 'Organization Name',
          issuedDate: data.date ? new Date(data.date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          }) : new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          }),
          description: `${data.description || 'This certifies that the above named has successfully completed'} ${data.courseName || ''}`.trim(),
          template: template as any,
          credentialType: 'Certificate'
        }

        const url = await previewCertificate(certificateData)
        setPreviewUrl(url)
      } catch (err) {
        console.error('Error generating certificate preview:', err)
        setError('Failed to generate certificate preview')
      } finally {
        setIsLoading(false)
      }
    }

    generatePreview()
  }, [template, data])

  if (isLoading) {
    return (
      <div className="w-full max-w-4xl mx-auto bg-gray-100 border-2 border-dashed border-gray-300 relative flex items-center justify-center" style={{ aspectRatio: '4/3', minHeight: '400px' }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Generating certificate preview...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="w-full max-w-4xl mx-auto bg-red-50 border-2 border-red-200 relative flex items-center justify-center" style={{ aspectRatio: '4/3', minHeight: '400px' }}>
        <div className="text-center">
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <img
        src={previewUrl}
        alt="Certificate Preview"
        className="w-full h-auto border-2 border-gray-200 rounded-lg shadow-lg"
        style={{ aspectRatio: '4/3' }}
      />
    </div>
  )
}
