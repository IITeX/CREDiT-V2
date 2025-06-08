"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Upload,
  FileText,
  CheckCircle,
  XCircle,
  Loader2,
  Brain,
  Shield,
  AlertTriangle,
  RefreshCw,
} from "lucide-react"
import { aiVerificationSteps, type AIVerificationState } from "@/lib/mock-data"

interface AIVerificationDemoProps {
  onComplete?: (success: boolean) => void
  className?: string
}

export function AIVerificationDemo({ onComplete, className }: AIVerificationDemoProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const [hasStarted, setHasStarted] = useState(false)
  const [attempts, setAttempts] = useState(0)

  const currentState = aiVerificationSteps[currentStep] || aiVerificationSteps[0]

  const startVerification = () => {
    setHasStarted(true)
    setIsRunning(true)
    setIsComplete(false)
    setCurrentStep(0)
    setAttempts(prev => prev + 1)
  }

  const resetDemo = () => {
    setCurrentStep(0)
    setIsRunning(false)
    setIsComplete(false)
    setHasStarted(false)
    setAttempts(0)
  }

  useEffect(() => {
    if (!isRunning) return

    const timer = setTimeout(() => {
      if (currentStep < aiVerificationSteps.length - 1) {
        setCurrentStep(prev => prev + 1)
      } else {
        setIsRunning(false)
        setIsComplete(true)
        onComplete?.(true)
      }
    }, 1500) // 1.5 seconds between steps

    return () => clearTimeout(timer)
  }, [currentStep, isRunning, onComplete])

  const getStatusIcon = (status: AIVerificationState['status']) => {
    switch (status) {
      case 'processing':
        return <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'error':
        return <XCircle className="h-4 w-4 text-red-600" />
      default:
        return <FileText className="h-4 w-4 text-gray-400" />
    }
  }

  const getStatusColor = (status: AIVerificationState['status']) => {
    switch (status) {
      case 'processing':
        return 'border-blue-200 bg-blue-50'
      case 'success':
        return 'border-green-200 bg-green-50'
      case 'error':
        return 'border-red-200 bg-red-50'
      default:
        return 'border-gray-200 bg-gray-50'
    }
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Brain className="h-5 w-5 text-purple-600" />
          <span>AI Document Verification</span>
          <Badge variant="secondary" className="bg-purple-100 text-purple-700">
            Demo
          </Badge>
        </CardTitle>
        <CardDescription>
          Experience our AI-powered document verification system
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Demo Instructions */}
        {!hasStarted && (
          <Alert>
            <Shield className="h-4 w-4" />
            <AlertDescription>
              This demo simulates our AI verification process. Click "Start Verification" to see how our system analyzes and validates documents.
            </AlertDescription>
          </Alert>
        )}

        {/* Upload Area */}
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          <div className="space-y-3">
            <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
              <Upload className="h-6 w-6 text-gray-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Upload verification documents</p>
              <p className="text-xs text-gray-500">PDF, PNG, JPG up to 10MB</p>
            </div>
            {!hasStarted ? (
              <Button onClick={startVerification} className="mt-3">
                <Upload className="h-4 w-4 mr-2" />
                Start Verification
              </Button>
            ) : (
              <Button 
                onClick={resetDemo} 
                variant="outline" 
                className="mt-3"
                disabled={isRunning}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Reset Demo
              </Button>
            )}
          </div>
        </div>

        {/* Verification Progress */}
        {hasStarted && (
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Verification Progress</span>
                <span className="text-sm text-gray-500">{currentState.progress}%</span>
              </div>
              <Progress value={currentState.progress} className="h-2" />
            </div>

            {/* Current Status */}
            <Card className={`border-2 ${getStatusColor(currentState.status)}`}>
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  {getStatusIcon(currentState.status)}
                  <div className="flex-1">
                    <p className="text-sm font-medium">{currentState.message}</p>
                    <p className="text-xs text-gray-500">
                      Step {currentState.step} of {aiVerificationSteps.length}
                    </p>
                  </div>
                  {currentState.status === 'error' && attempts === 1 && (
                    <Badge variant="destructive" className="text-xs">
                      Attempt {attempts}
                    </Badge>
                  )}
                  {currentState.status === 'success' && (
                    <Badge variant="default" className="bg-green-600 text-xs">
                      Verified
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Verification Steps History */}
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-900">Verification Log</h4>
              <div className="space-y-1 max-h-32 overflow-y-auto">
                {aiVerificationSteps.slice(0, currentStep + 1).map((step, index) => (
                  <div
                    key={index}
                    className={`flex items-center space-x-2 p-2 rounded text-xs ${
                      index === currentStep ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50'
                    }`}
                  >
                    {getStatusIcon(step.status)}
                    <span className="flex-1">{step.message}</span>
                    <span className="text-gray-400">
                      {new Date().toLocaleTimeString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Completion Message */}
        {isComplete && (
          <Alert className="border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              <strong>Verification Complete!</strong> Your documents have been successfully verified by our AI system. 
              You can now proceed with your registration.
            </AlertDescription>
          </Alert>
        )}

        {/* Demo Features */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="text-sm font-medium text-gray-900 mb-2">AI Verification Features</h4>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-3 w-3 text-green-600" />
              <span>Document Type Detection</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-3 w-3 text-green-600" />
              <span>Authenticity Verification</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-3 w-3 text-green-600" />
              <span>Content Analysis</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-3 w-3 text-green-600" />
              <span>Fraud Detection</span>
            </div>
          </div>
        </div>

        {/* Demo Notice */}
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className="text-xs">
            This is a demonstration of our AI verification system. In production, actual document analysis would be performed.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  )
}
