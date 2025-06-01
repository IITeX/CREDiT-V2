#!/bin/bash

# Generate TypeScript declarations and update environment
echo "🚀 Generating TypeScript declarations and updating environment..."

# Check if dfx is installed
if ! command -v dfx &> /dev/null; then
    echo "❌ Error: dfx is not installed. Please install DFINITY SDK first."
    exit 1
fi

# Start dfx if not running
if ! dfx ping &> /dev/null; then
    echo "📡 Starting dfx..."
    dfx start --background --clean
    sleep 5
fi

# Deploy canisters
echo "🔧 Deploying canisters..."
dfx deploy --network local

# Generate TypeScript declarations
echo "📝 Generating TypeScript declarations..."
dfx generate

# Check if declarations were generated
if [ -d "src/declarations" ]; then
    echo "✅ TypeScript declarations generated successfully"
    
    # Create types file if it doesn't exist
    if [ ! -f "types/ic.d.ts" ]; then
        mkdir -p types
        cat > types/ic.d.ts << EOF
// Generated types for ICP integration
import type { ActorSubclass } from '@dfinity/agent'
import type { Principal } from '@dfinity/principal'

// Re-export generated types
export * from '../src/declarations/user_management/user_management.did'
export * from '../src/declarations/credential_nft/credential_nft.did'
export * from '../src/declarations/verification/verification.did'
export * from '../src/declarations/storage/storage.did'

// Actor types
export type UserManagementActor = ActorSubclass<import('../src/declarations/user_management/user_management.did')._SERVICE>
export type CredentialNFTActor = ActorSubclass<import('../src/declarations/credential_nft/credential_nft.did')._SERVICE>
export type VerificationActor = ActorSubclass<import('../src/declarations/verification/verification.did')._SERVICE>
export type StorageActor = ActorSubclass<import('../src/declarations/storage/storage.did')._SERVICE>
EOF
        echo "✅ Created types/ic.d.ts"
    fi
else
    echo "⚠️  Warning: TypeScript declarations not found. Continuing with manual types..."
fi

# Get canister IDs
echo "🆔 Extracting canister IDs..."
CANISTER_IDS_FILE=".dfx/local/canister_ids.json"

if [ -f "$CANISTER_IDS_FILE" ]; then
    USER_MANAGEMENT_ID=$(jq -r '.user_management.local' "$CANISTER_IDS_FILE" 2>/dev/null || echo "")
    CREDENTIAL_NFT_ID=$(jq -r '.credential_nft.local' "$CANISTER_IDS_FILE" 2>/dev/null || echo "")
    VERIFICATION_ID=$(jq -r '.verification.local' "$CANISTER_IDS_FILE" 2>/dev/null || echo "")
    STORAGE_ID=$(jq -r '.storage.local' "$CANISTER_IDS_FILE" 2>/dev/null || echo "")
    
    echo "📋 Canister IDs:"
    echo "  - User Management: $USER_MANAGEMENT_ID"
    echo "  - Credential NFT: $CREDENTIAL_NFT_ID"
    echo "  - Verification: $VERIFICATION_ID"
    echo "  - Storage: $STORAGE_ID"
else
    echo "⚠️  Warning: Canister IDs file not found"
fi

# Update or create .env.local
echo "🔧 Updating environment variables..."
ENV_FILE=".env.local"

# Create or update .env.local
cat > "$ENV_FILE" << EOF
# ICP Canister IDs (Local Development)
NEXT_PUBLIC_USER_MANAGEMENT_CANISTER_ID="$USER_MANAGEMENT_ID"
NEXT_PUBLIC_CREDENTIAL_NFT_CANISTER_ID="$CREDENTIAL_NFT_ID"
NEXT_PUBLIC_VERIFICATION_CANISTER_ID="$VERIFICATION_ID"
NEXT_PUBLIC_STORAGE_CANISTER_ID="$STORAGE_ID"

# ICP Network Configuration
NEXT_PUBLIC_IC_HOST="http://localhost:4943"
NEXT_PUBLIC_INTERNET_IDENTITY_CANISTER_ID="rdmx6-jaaaa-aaaah-qdrha-cai"

# Development Settings
NODE_ENV="development"
NEXT_PUBLIC_DFX_NETWORK="local"
EOF

echo "✅ Environment variables updated in $ENV_FILE"

# Update hooks/useIC.ts with proper canister IDs
echo "🔄 Updating useIC hooks with canister IDs..."
cat > hooks/useIC.ts << EOF
import { useState, useEffect, useCallback } from 'react'
import { Actor, HttpAgent } from '@dfinity/agent'
import { Principal } from '@dfinity/principal'
import { useAuth } from '@/contexts/auth-context'

// Import generated declarations if available
let userManagementIdl: any, credentialNftIdl: any, verificationIdl: any, storageIdl: any

try {
  // Try to import generated declarations
  userManagementIdl = require('../src/declarations/user_management').idlFactory
  credentialNftIdl = require('../src/declarations/credential_nft').idlFactory
  verificationIdl = require('../src/declarations/verification').idlFactory
  storageIdl = require('../src/declarations/storage').idlFactory
} catch (e) {
  console.warn('Generated declarations not found, using fallback types')
}

// Types for when declarations are not available
type UserManagementActor = any
type CredentialNFTActor = any
type VerificationActor = any
type StorageActor = any

interface CanisterIds {
  userManagement: string
  credentialNft: string
  verification: string
  storage: string
}

const CANISTER_IDS: CanisterIds = {
  userManagement: "$USER_MANAGEMENT_ID",
  credentialNft: "$CREDENTIAL_NFT_ID",
  verification: "$VERIFICATION_ID",
  storage: "$STORAGE_ID",
}

const HOST = process.env.NODE_ENV === 'production' 
  ? 'https://ic0.app' 
  : 'http://localhost:4943'

// User Management Hook
export const useUserManagement = () => {
  const { isAuthenticated, identity, principal } = useAuth()
  const [actor, setActor] = useState<UserManagementActor | null>(null)
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isAuthenticated && identity && userManagementIdl) {
      const agent = new HttpAgent({ host: HOST, identity })
      
      if (process.env.NODE_ENV !== 'production') {
        agent.fetchRootKey().catch(console.error)
      }

      const actor = Actor.createActor(userManagementIdl, {
        agent,
        canisterId: CANISTER_IDS.userManagement,
      })
      setActor(actor)
    }
  }, [isAuthenticated, identity])

  const registerUser = useCallback(async (
    email: string,
    role: any,
    organizationName?: string
  ) => {
    if (!actor) throw new Error('Not authenticated')
    setLoading(true)
    try {
      const result = await actor.registerUser(email, role, organizationName ? [organizationName] : [])
      if ('Ok' in result) {
        setUser(result.Ok)
        return result.Ok
      } else {
        throw new Error(Object.keys(result.Err)[0])
      }
    } finally {
      setLoading(false)
    }
  }, [actor])

  const getMyProfile = useCallback(async () => {
    if (!actor) return null
    setLoading(true)
    try {
      const result = await actor.getMyProfile()
      if ('Ok' in result) {
        setUser(result.Ok)
        return result.Ok
      } else {
        throw new Error(Object.keys(result.Err)[0])
      }
    } finally {
      setLoading(false)
    }
  }, [actor])

  return { user, registerUser, getMyProfile, loading }
}

// Credentials Hook
export const useCredentials = () => {
  const { isAuthenticated, identity, principal } = useAuth()
  const [actor, setActor] = useState<CredentialNFTActor | null>(null)
  const [credentials, setCredentials] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isAuthenticated && identity && credentialNftIdl) {
      const agent = new HttpAgent({ host: HOST, identity })
      
      if (process.env.NODE_ENV !== 'production') {
        agent.fetchRootKey().catch(console.error)
      }

      const actor = Actor.createActor(credentialNftIdl, {
        agent,
        canisterId: CANISTER_IDS.credentialNft,
      })
      setActor(actor)
    }
  }, [isAuthenticated, identity])

  const createCredential = useCallback(async (
    credentialType: any,
    title: string,
    description: string,
    recipient: string,
    recipientName: string,
    metadata: any = {},
    documentHash: number[] = [],
    expiresAt: any[] = []
  ) => {
    if (!actor) throw new Error('Not authenticated')
    setLoading(true)
    try {
      const result = await actor.createCredential(
        credentialType,
        title,
        description,
        recipient,
        recipientName,
        metadata,
        documentHash,
        expiresAt
      )
      if ('Ok' in result) {
        return result.Ok
      } else {
        throw new Error(Object.keys(result.Err)[0])
      }
    } finally {
      setLoading(false)
    }
  }, [actor])

  const getMyCredentials = useCallback(async () => {
    if (!actor || !principal) return []
    setLoading(true)
    try {
      const result = await actor.getCredentialsByRecipient(principal.toText())
      setCredentials(result)
      return result
    } finally {
      setLoading(false)
    }
  }, [actor, principal])

  return { credentials, createCredential, getMyCredentials, loading }
}

// Verification Hook
export const useVerification = () => {
  const { isAuthenticated, identity } = useAuth()
  const [actor, setActor] = useState<VerificationActor | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isAuthenticated && identity && verificationIdl) {
      const agent = new HttpAgent({ host: HOST, identity })
      
      if (process.env.NODE_ENV !== 'production') {
        agent.fetchRootKey().catch(console.error)
      }

      const actor = Actor.createActor(verificationIdl, {
        agent,
        canisterId: CANISTER_IDS.verification,
      })
      setActor(actor)
    }
  }, [isAuthenticated, identity])

  const submitVerificationRequest = useCallback(async (
    credentialId: string,
    verifierPrincipal: string,
    message: string
  ) => {
    if (!actor) throw new Error('Not authenticated')
    setLoading(true)
    try {
      const result = await actor.submitVerificationRequest(
        credentialId,
        Principal.fromText(verifierPrincipal),
        message
      )
      if ('Ok' in result) {
        return result.Ok
      } else {
        throw new Error(Object.keys(result.Err)[0])
      }
    } finally {
      setLoading(false)
    }
  }, [actor])

  return { submitVerificationRequest, loading }
}

// Storage Hook
export const useStorage = () => {
  const { isAuthenticated, identity } = useAuth()
  const [actor, setActor] = useState<StorageActor | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isAuthenticated && identity && storageIdl) {
      const agent = new HttpAgent({ host: HOST, identity })
      
      if (process.env.NODE_ENV !== 'production') {
        agent.fetchRootKey().catch(console.error)
      }

      const actor = Actor.createActor(storageIdl, {
        agent,
        canisterId: CANISTER_IDS.storage,
      })
      setActor(actor)
    }
  }, [isAuthenticated, identity])

  const uploadDocument = useCallback(async (
    filename: string,
    content: number[],
    contentType: string
  ) => {
    if (!actor) throw new Error('Not authenticated')
    setLoading(true)
    try {
      const result = await actor.uploadDocument(filename, content, contentType)
      if ('Ok' in result) {
        return result.Ok
      } else {
        throw new Error(Object.keys(result.Err)[0])
      }
    } finally {
      setLoading(false)
    }
  }, [actor])

  return { uploadDocument, loading }
}
EOF

echo "✅ Updated hooks/useIC.ts with generated types and canister IDs"

# Install dependencies if package.json exists
if [ -f "package.json" ]; then
    echo "📦 Installing/updating dependencies..."
    npm install
fi

echo ""
echo "🎉 Setup complete! Your ICP backend is ready."
echo ""
echo "📋 Next steps:"
echo "  1. Run 'npm run dev' to start the development server"
echo "  2. Visit http://localhost:3000 to test the application"
echo "  3. Use 'dfx canister call' commands to test backend functions"
echo ""
echo "🔧 Useful commands:"
echo "  - dfx canister call user_management getMyProfile"
echo "  - dfx canister call credential_nft getAllCredentials"
echo "  - npm run test:backend (run end-to-end tests)"
echo ""
echo "🌐 Access Candid UI:"
echo "  - User Management: http://localhost:4943/?canisterId=\$(dfx canister id user_management)"
echo "  - Credential NFT: http://localhost:4943/?canisterId=\$(dfx canister id credential_nft)"
echo ""
