import React, { useState, useEffect } from 'react'
import { Wifi, WifiOff, AlertTriangle } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

interface NetworkStatusProps {
  showDetails?: boolean
  className?: string
}

export function NetworkStatus({ showDetails = false, className = '' }: NetworkStatusProps) {
  const [status, setStatus] = useState<'connected' | 'disconnected' | 'error' | 'checking'>('checking')
  const [network, setNetwork] = useState<string>('unknown')
  const [lastChecked, setLastChecked] = useState<Date | null>(null)

  const checkNetworkStatus = async () => {
    try {
      setStatus('checking')
      
      // Check if we can reach the IC replica
      const host = process.env.NEXT_PUBLIC_IC_HOST || 'http://localhost:4943'
      const network = process.env.NEXT_PUBLIC_DFX_NETWORK || 'local'
      
      setNetwork(network)
      
      // Try to ping the replica
      const response = await fetch(`${host}/api/v2/status`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/cbor' }
      })
      
      if (response.ok || response.status === 200) {
        setStatus('connected')
      } else {
        setStatus('error')
      }
    } catch (error) {
      console.warn('Network status check failed:', error)
      setStatus('disconnected')
    } finally {
      setLastChecked(new Date())
    }
  }

  useEffect(() => {
    checkNetworkStatus()
    
    // Check network status every 30 seconds
    const interval = setInterval(checkNetworkStatus, 30000)
    
    return () => clearInterval(interval)
  }, [])

  const getStatusColor = () => {
    switch (status) {
      case 'connected':
        return 'bg-green-500'
      case 'disconnected':
        return 'bg-red-500'
      case 'error':
        return 'bg-yellow-500'
      case 'checking':
        return 'bg-gray-400'
      default:
        return 'bg-gray-400'
    }
  }

  const getStatusText = () => {
    switch (status) {
      case 'connected':
        return `Connected to ${network === 'local' ? 'Local' : 'IC'} Network`
      case 'disconnected':
        return 'Disconnected from IC'
      case 'error':
        return 'Connection Issues'
      case 'checking':
        return 'Checking Connection...'
      default:
        return 'Unknown Status'
    }
  }

  const getStatusIcon = () => {
    switch (status) {
      case 'connected':
        return <Wifi className="h-3 w-3" />
      case 'disconnected':
        return <WifiOff className="h-3 w-3" />
      case 'error':
        return <AlertTriangle className="h-3 w-3" />
      case 'checking':
        return <Wifi className="h-3 w-3 animate-pulse" />
      default:
        return <WifiOff className="h-3 w-3" />
    }
  }

  const getTooltipContent = () => {
    return (
      <div className="space-y-1 text-xs">
        <div>Status: {getStatusText()}</div>
        <div>Network: {network}</div>
        {lastChecked && (
          <div>Last checked: {lastChecked.toLocaleTimeString()}</div>
        )}
        <div className="text-xs opacity-75 mt-2">
          Click to refresh status
        </div>
      </div>
    )
  }

  if (!showDetails) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={checkNetworkStatus}
              className={`inline-flex items-center space-x-1 ${className}`}
            >
              <div className={`h-2 w-2 rounded-full ${getStatusColor()}`} />
              {getStatusIcon()}
            </button>
          </TooltipTrigger>
          <TooltipContent>
            {getTooltipContent()}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <Badge 
        variant={status === 'connected' ? 'default' : 'destructive'}
        className="flex items-center space-x-1 cursor-pointer"
        onClick={checkNetworkStatus}
      >
        {getStatusIcon()}
        <span className="text-xs">{getStatusText()}</span>
      </Badge>
      
      {process.env.NODE_ENV === 'development' && (
        <div className="text-xs text-gray-500">
          {network} | {lastChecked?.toLocaleTimeString()}
        </div>
      )}
    </div>
  )
}

// Hook for getting network status
export function useNetworkStatus() {
  const [status, setStatus] = useState<'connected' | 'disconnected' | 'error' | 'checking'>('checking')
  const [network, setNetwork] = useState<string>('unknown')

  const checkStatus = async () => {
    try {
      setStatus('checking')
      
      const host = process.env.NEXT_PUBLIC_IC_HOST || 'http://localhost:4943'
      const network = process.env.NEXT_PUBLIC_DFX_NETWORK || 'local'
      
      setNetwork(network)
      
      const response = await fetch(`${host}/api/v2/status`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/cbor' }
      })
      
      if (response.ok) {
        setStatus('connected')
      } else {
        setStatus('error')
      }
    } catch (error) {
      setStatus('disconnected')
    }
  }

  useEffect(() => {
    checkStatus()
    const interval = setInterval(checkStatus, 30000)
    return () => clearInterval(interval)
  }, [])

  return { status, network, checkStatus }
}
