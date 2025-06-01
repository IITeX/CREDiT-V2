"use client"

import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Upload, File, X, CheckCircle, AlertCircle } from "lucide-react"

interface DocumentUploadProps {
  onFilesChange: (files: File[]) => void
  acceptedTypes?: string[]
  maxFiles?: number
  maxSize?: number
}

export function DocumentUpload({
  onFilesChange,
  acceptedTypes = [".pdf", ".jpg", ".jpeg", ".png"],
  maxFiles = 5,
  maxSize = 10 * 1024 * 1024, // 10MB
}: DocumentUploadProps) {
  const [files, setFiles] = useState<File[]>([])
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({})

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const newFiles = [...files, ...acceptedFiles].slice(0, maxFiles)
      setFiles(newFiles)
      onFilesChange(newFiles)

      // Simulate upload progress
      acceptedFiles.forEach((file) => {
        const fileName = file.name
        let progress = 0
        const interval = setInterval(() => {
          progress += 10
          setUploadProgress((prev) => ({ ...prev, [fileName]: progress }))
          if (progress >= 100) {
            clearInterval(interval)
          }
        }, 100)
      })
    },
    [files, maxFiles, onFilesChange],
  )

  const removeFile = (fileToRemove: File) => {
    const newFiles = files.filter((file) => file !== fileToRemove)
    setFiles(newFiles)
    onFilesChange(newFiles)
    setUploadProgress((prev) => {
      const newProgress = { ...prev }
      delete newProgress[fileToRemove.name]
      return newProgress
    })
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptedTypes.reduce((acc, type) => {
      acc[type] = []
      return acc
    }, {} as any),
    maxSize,
    maxFiles: maxFiles - files.length,
  })

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
          isDragActive ? "border-green-500 bg-green-50" : "border-green-200 hover:border-green-400 hover:bg-green-50"
        }`}
      >
        <input {...getInputProps()} />
        <Upload className="mx-auto h-12 w-12 text-green-400 mb-4" />
        {isDragActive ? (
          <p className="text-green-600">Drop the files here...</p>
        ) : (
          <div className="space-y-2">
            <p className="text-green-600">
              Drag & drop files here, or <span className="font-medium">click to browse</span>
            </p>
            <p className="text-sm text-green-500">
              Accepted: {acceptedTypes.join(", ")} • Max {maxFiles} files • Max {formatFileSize(maxSize)} each
            </p>
          </div>
        )}
      </div>

      {files.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-medium text-green-700">
            Uploaded Files ({files.length}/{maxFiles})
          </h4>
          {files.map((file, index) => {
            const progress = uploadProgress[file.name] || 0
            const isComplete = progress >= 100
            return (
              <div
                key={index}
                className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg border border-green-200"
              >
                <div className="flex-shrink-0">
                  {isComplete ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : (
                    <File className="h-5 w-5 text-green-500" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-green-800 truncate">{file.name}</p>
                  <p className="text-xs text-green-600">{formatFileSize(file.size)}</p>
                  {!isComplete && <Progress value={progress} className="mt-1 h-1" />}
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFile(file)}
                  className="flex-shrink-0 text-green-600 hover:text-green-800 hover:bg-green-100"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )
          })}
        </div>
      )}

      {files.length >= maxFiles && (
        <div className="flex items-center space-x-2 text-sm text-yellow-600 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
          <AlertCircle className="h-4 w-4" />
          <span>Maximum number of files reached ({maxFiles})</span>
        </div>
      )}
    </div>
  )
}
