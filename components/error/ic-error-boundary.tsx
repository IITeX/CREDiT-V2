import React, { Component, ErrorInfo, ReactNode } from 'react'
import { AlertTriangle, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
  errorInfo?: ErrorInfo
}

export class ICErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('IC Error Boundary caught an error:', error, errorInfo)
    this.setState({ error, errorInfo })
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined })
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="flex items-center justify-center min-h-[400px] p-6">
          <div className="max-w-md w-full">
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Internet Computer Connection Error</AlertTitle>
              <AlertDescription className="mt-2">
                <div className="space-y-2">
                  <p>
                    There was an error connecting to the Internet Computer backend.
                    This might be due to:
                  </p>
                  <ul className="list-disc list-inside text-sm space-y-1">
                    <li>Network connectivity issues</li>
                    <li>Backend canisters not deployed</li>
                    <li>Invalid canister IDs</li>
                    <li>Authentication problems</li>
                  </ul>
                  {process.env.NODE_ENV === 'development' && (
                    <details className="mt-3 p-2 bg-gray-50 rounded text-xs">
                      <summary className="cursor-pointer font-medium">
                        Error Details (Development)
                      </summary>
                      <pre className="mt-2 whitespace-pre-wrap">
                        {this.state.error?.toString()}
                        {this.state.errorInfo?.componentStack}
                      </pre>
                    </details>
                  )}
                </div>
              </AlertDescription>
            </Alert>
            
            <div className="mt-4 flex gap-2">
              <Button 
                onClick={this.handleRetry}
                className="flex items-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Retry Connection
              </Button>
              
              <Button 
                variant="outline" 
                onClick={() => window.location.reload()}
              >
                Reload Page
              </Button>
            </div>

            {process.env.NODE_ENV === 'development' && (
              <div className="mt-4 p-3 bg-blue-50 rounded-lg text-sm">
                <p className="font-medium text-blue-800">Development Tips:</p>
                <ul className="mt-1 text-blue-700 list-disc list-inside space-y-1">
                  <li>Ensure DFX is running: <code>dfx start</code></li>
                  <li>Check canister deployment: <code>dfx canister status user_management</code></li>
                  <li>Verify environment variables in <code>.env.local</code></li>
                  <li>Check browser console for detailed errors</li>
                </ul>
              </div>
            )}
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

// HOC wrapper for easier usage
export function withICErrorBoundary<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  fallback?: ReactNode
) {
  return function WithErrorBoundaryComponent(props: P) {
    return (
      <ICErrorBoundary fallback={fallback}>
        <WrappedComponent {...props} />
      </ICErrorBoundary>
    )
  }
}
