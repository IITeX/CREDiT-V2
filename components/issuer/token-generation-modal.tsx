"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Minus, Award, AlertCircle } from "lucide-react"

interface TokenGenerationModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onGenerate: (count: number) => void
}

export function TokenGenerationModal({
  open,
  onOpenChange,
  onGenerate,
}: TokenGenerationModalProps) {
  const [tokenCount, setTokenCount] = useState(1)
  const [isGenerating, setIsGenerating] = useState(false)

  const handleGenerate = async () => {
    if (tokenCount < 1 || tokenCount > 100) return

    setIsGenerating(true)
    try {
      // Simulate generation delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      onGenerate(tokenCount)
      onOpenChange(false)
      setTokenCount(1) // Reset for next time
    } catch (error) {
      console.error('Error generating tokens:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  const incrementCount = () => {
    if (tokenCount < 100) {
      setTokenCount(prev => prev + 1)
    }
  }

  const decrementCount = () => {
    if (tokenCount > 1) {
      setTokenCount(prev => prev - 1)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 1
    if (value >= 1 && value <= 100) {
      setTokenCount(value)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Award className="h-5 w-5 text-green-600" />
            <span>Generate Credential Tokens</span>
          </DialogTitle>
          <DialogDescription>
            Specify how many credential tokens you want to generate. Each token will be unique and ready for file upload.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Token Count Input */}
          <div className="space-y-2">
            <Label htmlFor="token-count">Number of Tokens</Label>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="icon"
                onClick={decrementCount}
                disabled={tokenCount <= 1}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <Input
                id="token-count"
                type="number"
                min="1"
                max="100"
                value={tokenCount}
                onChange={handleInputChange}
                className="text-center font-mono text-lg"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={incrementCount}
                disabled={tokenCount >= 100}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-gray-500">
              You can generate between 1 and 100 tokens at once
            </p>
          </div>

          {/* Preview */}
          <Card className="bg-gray-50">
            <CardContent className="p-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Preview:</span>
                  <Badge variant="secondary">{tokenCount} token{tokenCount !== 1 ? 's' : ''}</Badge>
                </div>
                <div className="space-y-1">
                  <div className="text-xs text-gray-600">Token format examples:</div>
                  <div className="font-mono text-sm space-y-1">
                    <div className="text-green-700">• ED-2025-001</div>
                    <div className="text-green-700">• ED-2025-002</div>
                    {tokenCount > 2 && (
                      <div className="text-gray-500">• ... and {tokenCount - 2} more</div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Information */}
          <div className="flex items-start space-x-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <AlertCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-1">What happens next:</p>
              <ul className="text-xs space-y-1">
                <li>• Unique tokens will be generated with your organization prefix</li>
                <li>• You'll be able to upload a file for each token</li>
                <li>• Tokens can be copied and shared with recipients</li>
                <li>• All tokens will be saved to the blockchain once uploaded</li>
              </ul>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isGenerating}
          >
            Cancel
          </Button>
          <Button
            onClick={handleGenerate}
            disabled={isGenerating || tokenCount < 1 || tokenCount > 100}
            className="bg-green-600 hover:bg-green-700"
          >
            {isGenerating ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Generating...
              </>
            ) : (
              <>
                <Award className="h-4 w-4 mr-2" />
                Generate {tokenCount} Token{tokenCount !== 1 ? 's' : ''}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
