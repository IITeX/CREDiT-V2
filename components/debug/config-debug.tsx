"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getConfig, getCanisterIds } from "@/lib/config"
import { getCanisterUrls } from "@/lib/canister-utils"
import { CheckCircle, XCircle, AlertCircle } from "lucide-react"

export function ConfigDebug() {
  const config = getConfig()
  const canisterIds = getCanisterIds()
  const canisterUrls = getCanisterUrls()

  const envVars = {
    NODE_ENV: process.env.NODE_ENV,
    NEXT_PUBLIC_DFX_NETWORK: process.env.NEXT_PUBLIC_DFX_NETWORK,
    NEXT_PUBLIC_IC_HOST: process.env.NEXT_PUBLIC_IC_HOST,
    NEXT_PUBLIC_CREDENTIAL_NFT_CANISTER_ID: process.env.NEXT_PUBLIC_CREDENTIAL_NFT_CANISTER_ID,
    NEXT_PUBLIC_STORAGE_CANISTER_ID: process.env.NEXT_PUBLIC_STORAGE_CANISTER_ID,
    NEXT_PUBLIC_ENABLE_DEMO_LOGIN: process.env.NEXT_PUBLIC_ENABLE_DEMO_LOGIN,
    NEXT_PUBLIC_SIMULATION_MODE: process.env.NEXT_PUBLIC_SIMULATION_MODE,
  }

  const isConfiguredForDeployedCanisters = 
    envVars.NEXT_PUBLIC_DFX_NETWORK === 'ic' &&
    envVars.NEXT_PUBLIC_IC_HOST === 'https://ic0.app' &&
    canisterIds.credentialNft === 'k7fau-4yaaa-aaaao-qkb2a-cai' &&
    canisterIds.storage === 'kyega-raaaa-aaaao-qkb2q-cai'

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Configuration Status
            {isConfiguredForDeployedCanisters ? (
              <Badge variant="default" className="bg-green-100 text-green-800">
                <CheckCircle className="w-3 h-3 mr-1" />
                Deployed Canisters
              </Badge>
            ) : (
              <Badge variant="destructive">
                <XCircle className="w-3 h-3 mr-1" />
                Configuration Issue
              </Badge>
            )}
          </CardTitle>
          <CardDescription>
            Current configuration for canister connections
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!isConfiguredForDeployedCanisters && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center">
                <AlertCircle className="h-4 w-4 text-red-600 mr-2" />
                <p className="text-sm text-red-800">
                  Configuration not set for deployed canisters. This may cause connection errors.
                </p>
              </div>
            </div>
          )}

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h4 className="font-medium mb-2">Environment Variables</h4>
              <div className="space-y-2">
                {Object.entries(envVars).map(([key, value]) => (
                  <div key={key} className="flex justify-between items-center text-sm">
                    <span className="font-mono text-gray-600">{key}:</span>
                    <span className="font-mono bg-gray-100 px-2 py-1 rounded text-xs">
                      {value || 'undefined'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-2">Resolved Configuration</h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span>IC Host:</span>
                  <span className="font-mono bg-gray-100 px-2 py-1 rounded text-xs">
                    {config.IC_HOST}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span>Simulation Mode:</span>
                  <span className="font-mono bg-gray-100 px-2 py-1 rounded text-xs">
                    {config.SIMULATION_MODE.toString()}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span>Debug Mode:</span>
                  <span className="font-mono bg-gray-100 px-2 py-1 rounded text-xs">
                    {config.ENABLE_DEBUG.toString()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-2">Canister IDs</h4>
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span>Credential NFT:</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono bg-gray-100 px-2 py-1 rounded text-xs">
                    {canisterIds.credentialNft}
                  </span>
                  {canisterIds.credentialNft === 'k7fau-4yaaa-aaaao-qkb2a-cai' ? (
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  ) : (
                    <XCircle className="w-4 h-4 text-red-600" />
                  )}
                </div>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span>Storage:</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono bg-gray-100 px-2 py-1 rounded text-xs">
                    {canisterIds.storage}
                  </span>
                  {canisterIds.storage === 'kyega-raaaa-aaaao-qkb2q-cai' ? (
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  ) : (
                    <XCircle className="w-4 h-4 text-red-600" />
                  )}
                </div>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-2">Expected Configuration for Deployed Canisters</h4>
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <div className="space-y-1 text-sm">
                <div><strong>NEXT_PUBLIC_DFX_NETWORK:</strong> ic</div>
                <div><strong>NEXT_PUBLIC_IC_HOST:</strong> https://ic0.app</div>
                <div><strong>Credential NFT:</strong> k7fau-4yaaa-aaaao-qkb2a-cai</div>
                <div><strong>Storage:</strong> kyega-raaaa-aaaao-qkb2q-cai</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
