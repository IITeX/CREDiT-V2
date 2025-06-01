import React from 'react'
import { Loader2, Wifi, WifiOff } from 'lucide-react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertDescription } from '@/components/ui/alert'

interface ICLoadingStateProps {
  type?: 'credentials' | 'users' | 'verification' | 'profile' | 'generic'
  message?: string
  showSkeleton?: boolean
  isConnecting?: boolean
  error?: string | null
}

export function ICLoadingState({ 
  type = 'generic', 
  message, 
  showSkeleton = true,
  isConnecting = false,
  error
}: ICLoadingStateProps) {
  const getLoadingMessage = () => {
    if (message) return message
    
    switch (type) {
      case 'credentials':
        return isConnecting ? 'Connecting to credential blockchain...' : 'Loading credentials...'
      case 'users':
        return isConnecting ? 'Connecting to user management...' : 'Loading users...'
      case 'verification':
        return isConnecting ? 'Connecting to verification system...' : 'Loading verification data...'
      case 'profile':
        return isConnecting ? 'Connecting to user profile...' : 'Loading profile...'
      default:
        return isConnecting ? 'Connecting to Internet Computer...' : 'Loading...'
    }
  }

  const getSkeletonContent = () => {
    switch (type) {
      case 'credentials':
        return (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardHeader>
                  <div className="flex items-center space-x-2">
                    <Skeleton className="h-4 w-4 rounded" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                    <div className="flex space-x-2 mt-4">
                      <Skeleton className="h-8 w-20" />
                      <Skeleton className="h-8 w-20" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )
      
      case 'users':
        return (
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center space-x-3 p-3 border rounded-lg">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-24" />
                </div>
                <Skeleton className="h-8 w-16" />
              </div>
            ))}
          </div>
        )
      
      case 'verification':
        return (
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <Card key={i}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-5 w-40" />
                    <Skeleton className="h-6 w-20 rounded-full" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Skeleton className="h-4 w-4" />
                      <Skeleton className="h-4 w-32" />
                    </div>
                    <Skeleton className="h-20 w-full" />
                    <div className="flex space-x-2">
                      <Skeleton className="h-8 w-24" />
                      <Skeleton className="h-8 w-24" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )
      
      case 'profile':
        return (
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-4">
                <Skeleton className="h-16 w-16 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-6 w-32" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-28" />
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                </div>
                <Skeleton className="h-32 w-full" />
              </div>
            </CardContent>
          </Card>
        )
      
      default:
        return (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        )
    }
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <WifiOff className="h-4 w-4" />
        <AlertDescription>
          <div className="space-y-2">
            <p className="font-medium">Connection Error</p>
            <p className="text-sm">{error}</p>
            {process.env.NODE_ENV === 'development' && (
              <p className="text-xs opacity-75">
                Check that DFX is running and canisters are deployed
              </p>
            )}
          </div>
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-center p-6">
        <div className="text-center space-y-3">
          <div className="flex items-center justify-center space-x-2">
            {isConnecting ? (
              <Wifi className="h-5 w-5 text-blue-500 animate-pulse" />
            ) : (
              <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
            )}
            <span className="text-sm font-medium text-gray-600">
              {getLoadingMessage()}
            </span>
          </div>
          
          {isConnecting && (
            <div className="text-xs text-gray-500">
              Establishing secure connection to blockchain...
            </div>
          )}
        </div>
      </div>
      
      {showSkeleton && (
        <div className="animate-pulse">
          {getSkeletonContent()}
        </div>
      )}
    </div>
  )
}

// Specialized loading components
export function CredentialLoadingState(props: Omit<ICLoadingStateProps, 'type'>) {
  return <ICLoadingState {...props} type="credentials" />
}

export function UserLoadingState(props: Omit<ICLoadingStateProps, 'type'>) {
  return <ICLoadingState {...props} type="users" />
}

export function VerificationLoadingState(props: Omit<ICLoadingStateProps, 'type'>) {
  return <ICLoadingState {...props} type="verification" />
}

export function ProfileLoadingState(props: Omit<ICLoadingStateProps, 'type'>) {
  return <ICLoadingState {...props} type="profile" />
}
