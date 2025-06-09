"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import {
  Bell,
  CheckCircle,
  XCircle,
  Clock,
  User,
  FileText,
  Calendar,
  Mail,
  Eye,
  Loader2,
  AlertCircle,
  ArrowLeft,
  Download,
  Award,
} from "lucide-react"
import { AuthGuard } from "@/components/auth/auth-guard"
import { ICErrorBoundary } from "@/components/error/ic-error-boundary"
import { NetworkStatus } from "@/components/error/network-status"
import { useAuth } from "@/contexts/auth-context"
import { useUserManagement } from "@/hooks/useIC"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { useToast } from "@/hooks/use-toast"

// Mock credential requests data
const mockCredentialRequests = [
  {
    id: "req-001",
    requesterName: "John Doe",
    requesterEmail: "john.doe@email.com",
    credentialTitle: "Software Engineering Certificate",
    credentialType: "Professional Certificate",
    description: "Completed advanced software engineering program with focus on full-stack development",
    requestDate: "2025-01-28T10:30:00Z",
    status: "pending",
    attachments: ["certificate.png", "transcript.pdf"],
    requesterProfile: {
      avatar: "/placeholder-user.jpg",
      role: "Individual",
      joinDate: "2024-12-15"
    }
  },
  {
    id: "req-002", 
    requesterName: "Sarah Johnson",
    requesterEmail: "sarah.j@email.com",
    credentialTitle: "Project Management Certification",
    credentialType: "Professional Certificate",
    description: "Successfully completed PMP certification program",
    requestDate: "2025-01-27T14:20:00Z",
    status: "pending",
    attachments: ["pmp-certificate.jpg"],
    requesterProfile: {
      avatar: "/placeholder-user.jpg",
      role: "Individual", 
      joinDate: "2024-11-20"
    }
  },
  {
    id: "req-003",
    requesterName: "Mike Chen",
    requesterEmail: "mike.chen@email.com", 
    credentialTitle: "Data Science Bootcamp",
    credentialType: "Educational Certificate",
    description: "Completed 6-month intensive data science program",
    requestDate: "2025-01-26T09:15:00Z",
    status: "pending",
    attachments: ["bootcamp-certificate.png", "portfolio.pdf"],
    requesterProfile: {
      avatar: "/placeholder-user.jpg",
      role: "Individual",
      joinDate: "2024-10-05"
    }
  }
]

export default function IssuerNotificationPage() {
  return (
    <AuthGuard requireRegistration={false}>
      <ICErrorBoundary>
        <NetworkStatus />
        <IssuerNotificationContent />
      </ICErrorBoundary>
    </AuthGuard>
  )
}

function IssuerNotificationContent() {
  const { principal } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [selectedRequest, setSelectedRequest] = useState<any>(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [requests, setRequests] = useState(mockCredentialRequests)
  const [isLoading, setIsLoading] = useState(false)
  const [previewDocument, setPreviewDocument] = useState<string | null>(null)
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false)

  // ICP hooks
  const { user, getMyProfile, loading: userLoading } = useUserManagement()

  // Load user data on mount
  useEffect(() => {
    if (principal) {
      getMyProfile().catch(console.error)
    }
  }, [principal, getMyProfile])

  // Redirect non-issuers to individual dashboard
  useEffect(() => {
    if (user && user.role) {
      const userRole = Object.keys(user.role)[0]
      const isIssuer = userRole !== "Individual"
      
      if (!isIssuer) {
        router.push('/dashboard')
        return
      }
    }
  }, [user, router])

  const handleApprove = async (requestId: string) => {
    setIsLoading(true)
    try {
      // TODO: Implement actual approval logic with backend
      await new Promise(resolve => setTimeout(resolve, 1500)) // Simulate API call
      
      setRequests(prev => prev.map(req => 
        req.id === requestId 
          ? { ...req, status: 'approved' }
          : req
      ))
      
      toast({
        title: "Request Approved! ✅",
        description: "The credential request has been approved and the user will be notified.",
        variant: "default",
      })
      
      setIsDetailModalOpen(false)
    } catch (error) {
      console.error('Error approving request:', error)
      toast({
        title: "Error",
        description: "Failed to approve request. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleReject = async (requestId: string) => {
    setIsLoading(true)
    try {
      // TODO: Implement actual rejection logic with backend
      await new Promise(resolve => setTimeout(resolve, 1500)) // Simulate API call
      
      setRequests(prev => prev.map(req => 
        req.id === requestId 
          ? { ...req, status: 'rejected' }
          : req
      ))
      
      toast({
        title: "Request Rejected",
        description: "The credential request has been rejected and the user will be notified.",
        variant: "default",
      })
      
      setIsDetailModalOpen(false)
    } catch (error) {
      console.error('Error rejecting request:', error)
      toast({
        title: "Error", 
        description: "Failed to reject request. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const openRequestDetail = (request: any) => {
    setSelectedRequest(request)
    setIsDetailModalOpen(true)
  }

  const handleDocumentPreview = (documentName: string) => {
    // In a real implementation, this would fetch the actual document
    // For now, we'll show a mock preview
    setPreviewDocument(documentName)
    setIsPreviewModalOpen(true)

    toast({
      title: "Document Preview",
      description: `Opening preview for ${documentName}`,
    })
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Pending</Badge>
      case 'approved':
        return <Badge variant="default" className="bg-green-100 text-green-800">Approved</Badge>
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  const pendingRequests = requests.filter(req => req.status === 'pending')
  const processedRequests = requests.filter(req => req.status !== 'pending')

  if (userLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <Loader2 className="h-12 w-12 text-green-600 mx-auto mb-4 animate-spin" />
            <h2 className="text-xl font-semibold mb-2">Loading Notifications</h2>
            <p className="text-gray-600">Please wait while we load your notifications...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <DashboardLayout
      user={user}
      isUserVerified={true}
      isUserPending={false}
      isIssuer={true}
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <Bell className="h-8 w-8 mr-3 text-blue-600" />
                Credential Requests
              </h1>
              <p className="text-gray-600 mt-1">
                Review and manage credential verification requests from users
              </p>
            </div>
          </div>
          <Badge variant="secondary" className="text-lg px-3 py-1">
            {pendingRequests.length} Pending
          </Badge>
        </div>

        {/* Pending Requests */}
        {pendingRequests.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-yellow-600" />
                <span>Pending Requests ({pendingRequests.length})</span>
              </CardTitle>
              <CardDescription>
                These requests require your review and approval
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pendingRequests.map((request) => (
                  <div key={request.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4 flex-1">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={request.requesterProfile.avatar} />
                          <AvatarFallback>
                            {request.requesterName.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-1">
                            <h3 className="font-semibold text-gray-900">{request.requesterName}</h3>
                            <Badge variant="outline" className="text-xs">
                              {request.requesterProfile.role}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{request.requesterEmail}</p>
                          <div className="mb-2">
                            <p className="font-medium text-sm">{request.credentialTitle}</p>
                            <p className="text-xs text-gray-500">{request.credentialType}</p>
                          </div>
                          <p className="text-sm text-gray-700 line-clamp-2">{request.description}</p>
                          <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                            <div className="flex items-center">
                              <Calendar className="h-3 w-3 mr-1" />
                              {new Date(request.requestDate).toLocaleDateString()}
                            </div>
                            <div className="flex items-center">
                              <FileText className="h-3 w-3 mr-1" />
                              {request.attachments.length} attachment{request.attachments.length !== 1 ? 's' : ''}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 ml-4">
                        {getStatusBadge(request.status)}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openRequestDetail(request)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          Review
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* No Pending Requests */}
        {pendingRequests.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">All Caught Up!</h3>
              <p className="text-gray-600">No pending credential requests at the moment.</p>
            </CardContent>
          </Card>
        )}

        {/* Processed Requests */}
        {processedRequests.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span>Recent Activity ({processedRequests.length})</span>
              </CardTitle>
              <CardDescription>
                Previously reviewed credential requests
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {processedRequests.slice(0, 5).map((request) => (
                  <div key={request.id} className="flex items-center justify-between p-3 border rounded-lg bg-gray-50">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={request.requesterProfile.avatar} />
                        <AvatarFallback className="text-xs">
                          {request.requesterName.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-sm">{request.requesterName}</p>
                        <p className="text-xs text-gray-600">{request.credentialTitle}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getStatusBadge(request.status)}
                      <span className="text-xs text-gray-500">
                        {new Date(request.requestDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Request Detail Modal */}
      <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <FileText className="h-5 w-5" />
              <span>Credential Request Details</span>
            </DialogTitle>
            <DialogDescription>
              Review the details and decide whether to approve or reject this request
            </DialogDescription>
          </DialogHeader>

          {selectedRequest && (
            <div className="space-y-6">
              {/* Requester Info */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Requester Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-start space-x-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={selectedRequest.requesterProfile.avatar} />
                      <AvatarFallback>
                        {selectedRequest.requesterName.split(' ').map((n: string) => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{selectedRequest.requesterName}</h3>
                      <div className="space-y-1 text-sm text-gray-600">
                        <div className="flex items-center">
                          <Mail className="h-4 w-4 mr-2" />
                          {selectedRequest.requesterEmail}
                        </div>
                        <div className="flex items-center">
                          <User className="h-4 w-4 mr-2" />
                          {selectedRequest.requesterProfile.role}
                        </div>
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2" />
                          Joined {new Date(selectedRequest.requesterProfile.joinDate).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Credential Details */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Credential Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Title</Label>
                    <p className="text-lg font-semibold">{selectedRequest.credentialTitle}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Type</Label>
                    <p>{selectedRequest.credentialType}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Description</Label>
                    <p className="text-gray-700">{selectedRequest.description}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Request Date</Label>
                    <p>{new Date(selectedRequest.requestDate).toLocaleString()}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Attachments</Label>
                    <div className="space-y-2">
                      {selectedRequest.attachments.map((attachment: string, index: number) => (
                        <div key={index} className="flex items-center space-x-2 p-2 border rounded hover:bg-gray-50">
                          <FileText className="h-4 w-4 text-gray-500" />
                          <span className="text-sm flex-1">{attachment}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="ml-auto"
                            onClick={() => handleDocumentPreview(attachment)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              {selectedRequest.status === 'pending' && (
                <div className="flex justify-end space-x-3 pt-4 border-t">
                  <Button
                    variant="outline"
                    onClick={() => handleReject(selectedRequest.id)}
                    disabled={isLoading}
                    className="border-red-200 text-red-700 hover:bg-red-50"
                  >
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <XCircle className="h-4 w-4 mr-2" />
                    )}
                    Reject Request
                  </Button>
                  <Button
                    onClick={() => handleApprove(selectedRequest.id)}
                    disabled={isLoading}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <CheckCircle className="h-4 w-4 mr-2" />
                    )}
                    Approve Request
                  </Button>
                </div>
              )}

              {/* Status Display for Processed Requests */}
              {selectedRequest.status !== 'pending' && (
                <div className="text-center py-4 border-t">
                  <div className="flex items-center justify-center space-x-2">
                    {selectedRequest.status === 'approved' ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-600" />
                    )}
                    <span className="font-medium">
                      This request has been {selectedRequest.status}
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Document Preview Modal */}
      <Dialog open={isPreviewModalOpen} onOpenChange={setIsPreviewModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <FileText className="h-5 w-5" />
              <span>Document Preview</span>
            </DialogTitle>
            <DialogDescription>
              Preview of {previewDocument}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {previewDocument && (
              <div className="border rounded-lg p-6 bg-gray-50 text-center">
                <div className="space-y-4">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                    <FileText className="h-8 w-8 text-blue-600" />
                  </div>

                  <div>
                    <h3 className="font-semibold text-lg mb-2">{previewDocument}</h3>
                    <p className="text-gray-600 mb-4">
                      Document preview functionality would be implemented here.
                    </p>
                  </div>

                  {/* Mock Document Content */}
                  <div className="bg-white border rounded-lg p-6 text-left">
                    <div className="space-y-3">
                      <div className="border-b pb-2">
                        <h4 className="font-semibold">Document Information</h4>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="font-medium">File Name:</span>
                          <p className="text-gray-600">{previewDocument}</p>
                        </div>
                        <div>
                          <span className="font-medium">File Type:</span>
                          <p className="text-gray-600">
                            {previewDocument?.endsWith('.pdf')
                              ? 'PDF Document'
                              : previewDocument?.match(/\.(png|jpg|jpeg)$/i)
                                ? 'Certificate Image'
                                : 'Document File'}
                          </p>
                        </div>
                        <div>
                          <span className="font-medium">File Size:</span>
                          <p className="text-gray-600">2.4 MB</p>
                        </div>
                        <div>
                          <span className="font-medium">Upload Date:</span>
                          <p className="text-gray-600">{new Date().toLocaleDateString()}</p>
                        </div>
                      </div>

                      {/* Mock Content Preview */}
                      <div className="mt-4">
                        {previewDocument?.toLowerCase().endsWith('.pdf') ? (
                          // PDF Preview
                          <div className="p-4 bg-gray-50 rounded border-l-4 border-blue-500">
                            <p className="text-sm text-gray-700 mb-3">
                              <strong>PDF Document Preview:</strong>
                            </p>
                            <div className="bg-white border rounded p-6 text-center">
                              <FileText className="h-16 w-16 text-blue-600 mx-auto mb-4" />
                              <p className="text-gray-600">
                                PDF viewer would be embedded here.<br />
                                Document contains certification details, signatures, and official seals.
                              </p>
                            </div>
                          </div>
                        ) : (
                          // Image Preview (PNG, JPG, etc.)
                          <div className="p-4 bg-gray-50 rounded border-l-4 border-green-500">
                            <p className="text-sm text-gray-700 mb-3">
                              <strong>Certificate Image Preview:</strong>
                            </p>
                            <div className="bg-white border rounded p-4">
                              {/* Mock Certificate Image */}
                              <div className="relative bg-gradient-to-br from-blue-50 to-green-50 border-2 border-blue-200 rounded-lg p-8 text-center">
                                <div className="absolute top-4 left-4 w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                                  <Award className="h-6 w-6 text-white" />
                                </div>
                                <div className="absolute top-4 right-4 w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
                                  <CheckCircle className="h-6 w-6 text-white" />
                                </div>

                                <div className="space-y-4 mt-8">
                                  <h3 className="text-2xl font-bold text-gray-800">Certificate of Achievement</h3>
                                  <div className="w-24 h-1 bg-blue-600 mx-auto"></div>
                                  <p className="text-lg text-gray-700">This certifies that</p>
                                  <p className="text-xl font-semibold text-blue-800">John Doe</p>
                                  <p className="text-gray-700">has successfully completed</p>
                                  <p className="text-lg font-semibold text-gray-800">Software Engineering Program</p>
                                  <div className="flex justify-between items-end mt-8 pt-4 border-t">
                                    <div className="text-center">
                                      <div className="w-24 h-1 bg-gray-400 mb-2"></div>
                                      <p className="text-xs text-gray-600">Instructor Signature</p>
                                    </div>
                                    <div className="text-center">
                                      <p className="text-sm font-medium">January 28, 2025</p>
                                      <p className="text-xs text-gray-600">Date Issued</p>
                                    </div>
                                    <div className="text-center">
                                      <div className="w-24 h-1 bg-gray-400 mb-2"></div>
                                      <p className="text-xs text-gray-600">Official Seal</p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <p className="text-xs text-gray-500 mt-2 text-center">
                                Mock certificate preview - actual image would be displayed here
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-center space-x-3 pt-4">
                    <Button
                      variant="outline"
                      onClick={() => {
                        // Mock download functionality
                        toast({
                          title: "Download Started",
                          description: `Downloading ${previewDocument}...`,
                        })
                      }}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setIsPreviewModalOpen(false)}
                    >
                      Close Preview
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  )
}
