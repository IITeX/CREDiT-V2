"use client"

import { Award, Star, Shield } from "lucide-react"

interface CertificatePreviewProps {
  template: string
  data: any
}

export function CertificatePreview({ template, data }: CertificatePreviewProps) {
  const renderProfessionalTemplate = () => (
    <div className="w-full max-w-4xl mx-auto bg-white border-8 border-blue-600 relative" style={{ aspectRatio: '4/3' }}>
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="w-full h-full bg-gradient-to-br from-blue-100 to-blue-50"></div>
      </div>
      
      {/* Header */}
      <div className="text-center pt-8 pb-4">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
          <Award className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-blue-800 mb-2">{data.title || 'Certificate Title'}</h1>
        <div className="w-24 h-1 bg-blue-600 mx-auto"></div>
      </div>

      {/* Content */}
      <div className="px-12 py-6 text-center">
        <p className="text-lg text-gray-700 mb-6">This is to certify that</p>
        <h2 className="text-4xl font-bold text-gray-900 mb-6 border-b-2 border-blue-600 pb-2 inline-block">
          {data.recipientName || 'Recipient Name'}
        </h2>
        <p className="text-lg text-gray-700 mb-2">{data.description}</p>
        <p className="text-xl font-semibold text-blue-800 mb-6">{data.courseName || 'Course Name'}</p>
        
        {/* Date and Token */}
        <div className="flex justify-between items-center mt-8">
          <div className="text-left">
            <p className="text-sm text-gray-600">Date Issued</p>
            <p className="font-semibold">{data.date || new Date().toLocaleDateString()}</p>
          </div>
          {data.tokenId && (
            <div className="text-center">
              <p className="text-sm text-gray-600">Token ID</p>
              <p className="font-mono text-sm font-semibold">{data.tokenId}</p>
            </div>
          )}
          <div className="text-right">
            <p className="font-semibold">{data.signatoryName || 'Signatory Name'}</p>
            <p className="text-sm text-gray-600">{data.signatoryTitle || 'Title'}</p>
            <div className="w-24 h-0.5 bg-gray-400 mt-2"></div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-4 left-12 right-12">
        <div className="text-center">
          <p className="text-lg font-semibold text-blue-800">{data.organizationName || 'Organization Name'}</p>
        </div>
      </div>
    </div>
  )

  const renderAcademicTemplate = () => (
    <div className="w-full max-w-4xl mx-auto bg-white border-8 border-green-700 relative" style={{ aspectRatio: '4/3' }}>
      {/* Decorative corners */}
      <div className="absolute top-4 left-4 w-8 h-8 border-l-4 border-t-4 border-green-700"></div>
      <div className="absolute top-4 right-4 w-8 h-8 border-r-4 border-t-4 border-green-700"></div>
      <div className="absolute bottom-4 left-4 w-8 h-8 border-l-4 border-b-4 border-green-700"></div>
      <div className="absolute bottom-4 right-4 w-8 h-8 border-r-4 border-b-4 border-green-700"></div>
      
      {/* Header */}
      <div className="text-center pt-8 pb-6">
        <h1 className="text-4xl font-serif font-bold text-green-800 mb-4">{data.title || 'Academic Certificate'}</h1>
        <div className="w-32 h-1 bg-green-700 mx-auto mb-4"></div>
        <p className="text-lg text-gray-700 italic">{data.organizationName || 'Educational Institution'}</p>
      </div>

      {/* Content */}
      <div className="px-12 py-4 text-center">
        <p className="text-lg text-gray-700 mb-6">This certifies that</p>
        <h2 className="text-4xl font-serif font-bold text-gray-900 mb-6">
          {data.recipientName || 'Student Name'}
        </h2>
        <p className="text-lg text-gray-700 mb-2">{data.description}</p>
        <p className="text-xl font-semibold text-green-800 mb-8">{data.courseName || 'Program Name'}</p>
        
        {/* Seal */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-green-700 rounded-full flex items-center justify-center">
            <Star className="w-10 h-10 text-white" />
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-end">
          <div className="text-left">
            <p className="text-sm text-gray-600">Date</p>
            <p className="font-semibold">{data.date || new Date().toLocaleDateString()}</p>
            {data.tokenId && (
              <p className="text-xs text-gray-500 mt-2">ID: {data.tokenId}</p>
            )}
          </div>
          <div className="text-right">
            <div className="w-32 h-0.5 bg-gray-400 mb-1"></div>
            <p className="font-semibold">{data.signatoryName || 'Dean'}</p>
            <p className="text-sm text-gray-600">{data.signatoryTitle || 'Dean of Academic Affairs'}</p>
          </div>
        </div>
      </div>
    </div>
  )

  const renderCorporateTemplate = () => (
    <div className="w-full max-w-4xl mx-auto bg-white border-4 border-purple-600 relative" style={{ aspectRatio: '4/3' }}>
      {/* Header Bar */}
      <div className="bg-purple-600 text-white p-6 text-center">
        <h1 className="text-3xl font-bold">{data.title || 'Training Certificate'}</h1>
        <p className="text-purple-100">{data.organizationName || 'Corporate Training Center'}</p>
      </div>

      {/* Content */}
      <div className="px-12 py-8 text-center">
        <p className="text-lg text-gray-700 mb-6">This certifies that</p>
        <h2 className="text-4xl font-bold text-gray-900 mb-6 bg-purple-50 py-3 px-6 rounded">
          {data.recipientName || 'Employee Name'}
        </h2>
        <p className="text-lg text-gray-700 mb-2">{data.description}</p>
        <p className="text-xl font-semibold text-purple-800 mb-8">{data.courseName || 'Training Program'}</p>
        
        {/* Badge */}
        <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-600 rounded-full mb-6">
          <Shield className="w-8 h-8 text-white" />
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center mt-8 pt-6 border-t-2 border-purple-200">
          <div className="text-left">
            <p className="text-sm text-gray-600">Completion Date</p>
            <p className="font-semibold">{data.date || new Date().toLocaleDateString()}</p>
          </div>
          {data.tokenId && (
            <div className="text-center">
              <p className="text-sm text-gray-600">Certificate ID</p>
              <p className="font-mono text-sm font-semibold">{data.tokenId}</p>
            </div>
          )}
          <div className="text-right">
            <p className="font-semibold">{data.signatoryName || 'Training Director'}</p>
            <p className="text-sm text-gray-600">{data.signatoryTitle || 'Director'}</p>
          </div>
        </div>
      </div>
    </div>
  )

  const renderAchievementTemplate = () => (
    <div className="w-full max-w-4xl mx-auto bg-gradient-to-br from-yellow-50 to-orange-50 border-8 border-yellow-500 relative" style={{ aspectRatio: '4/3' }}>
      {/* Decorative elements */}
      <div className="absolute top-6 left-6">
        <Star className="w-8 h-8 text-yellow-500" />
      </div>
      <div className="absolute top-6 right-6">
        <Star className="w-8 h-8 text-yellow-500" />
      </div>
      
      {/* Header */}
      <div className="text-center pt-8 pb-4">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-yellow-500 rounded-full mb-4">
          <Award className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-yellow-800 mb-2">{data.title || 'Achievement Award'}</h1>
      </div>

      {/* Content */}
      <div className="px-12 py-6 text-center">
        <p className="text-lg text-gray-700 mb-6">Presented to</p>
        <h2 className="text-4xl font-bold text-gray-900 mb-6 text-shadow">
          {data.recipientName || 'Achiever Name'}
        </h2>
        <p className="text-lg text-gray-700 mb-2">{data.description}</p>
        <p className="text-xl font-semibold text-yellow-800 mb-8">{data.courseName || 'Achievement Category'}</p>
        
        {/* Organization and Details */}
        <div className="bg-white bg-opacity-70 rounded-lg p-6 mx-8">
          <p className="text-lg font-semibold text-yellow-800 mb-4">{data.organizationName || 'Awarding Organization'}</p>
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-600">Date</p>
              <p className="font-semibold">{data.date || new Date().toLocaleDateString()}</p>
            </div>
            {data.tokenId && (
              <div>
                <p className="text-sm text-gray-600">Award ID</p>
                <p className="font-mono text-sm font-semibold">{data.tokenId}</p>
              </div>
            )}
            <div className="text-right">
              <p className="font-semibold">{data.signatoryName || 'Director'}</p>
              <p className="text-sm text-gray-600">{data.signatoryTitle || 'Director'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  const renderExcellenceTemplate = () => (
    <div className="w-full max-w-4xl mx-auto bg-white border-8 border-red-600 relative" style={{ aspectRatio: '4/3' }}>
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="w-full h-full" style={{
          backgroundImage: 'radial-gradient(circle at 25% 25%, red 2px, transparent 2px)',
          backgroundSize: '20px 20px'
        }}></div>
      </div>
      
      {/* Header */}
      <div className="text-center pt-6 pb-4 relative z-10">
        <div className="inline-flex items-center justify-center w-24 h-24 bg-red-600 rounded-full mb-4">
          <Star className="w-12 h-12 text-white" />
        </div>
        <h1 className="text-4xl font-bold text-red-800 mb-2">{data.title || 'Excellence Certificate'}</h1>
        <div className="w-40 h-1 bg-red-600 mx-auto"></div>
      </div>

      {/* Content */}
      <div className="px-12 py-6 text-center relative z-10">
        <p className="text-lg text-gray-700 mb-6">This certificate is awarded to</p>
        <h2 className="text-4xl font-bold text-gray-900 mb-6 border-4 border-red-600 py-4 px-8 inline-block">
          {data.recipientName || 'Excellence Achiever'}
        </h2>
        <p className="text-lg text-gray-700 mb-2">{data.description}</p>
        <p className="text-xl font-semibold text-red-800 mb-6">{data.courseName || 'Excellence Category'}</p>
        
        {/* Excellence Badge */}
        <div className="bg-red-600 text-white py-2 px-6 rounded-full inline-block mb-6">
          <p className="font-bold">EXCELLENCE ACHIEVED</p>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center mt-8 pt-6 border-t-4 border-red-600">
          <div className="text-left">
            <p className="text-lg font-semibold text-red-800">{data.organizationName || 'Excellence Institute'}</p>
            <p className="text-sm text-gray-600">{data.date || new Date().toLocaleDateString()}</p>
            {data.tokenId && (
              <p className="text-xs text-gray-500">ID: {data.tokenId}</p>
            )}
          </div>
          <div className="text-right">
            <div className="w-32 h-0.5 bg-red-600 mb-2"></div>
            <p className="font-semibold">{data.signatoryName || 'CEO'}</p>
            <p className="text-sm text-gray-600">{data.signatoryTitle || 'Chief Executive Officer'}</p>
          </div>
        </div>
      </div>
    </div>
  )

  const renderTemplate = () => {
    switch (template) {
      case 'academic':
        return renderAcademicTemplate()
      case 'corporate':
        return renderCorporateTemplate()
      case 'achievement':
        return renderAchievementTemplate()
      case 'excellence':
        return renderExcellenceTemplate()
      default:
        return renderProfessionalTemplate()
    }
  }

  return (
    <div className="w-full overflow-auto">
      <div className=" p-4">
        {renderTemplate()}
      </div>
    </div>
  )
}
