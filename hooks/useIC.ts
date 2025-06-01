import { useState, useEffect, useCallback } from 'react'
import { Actor, HttpAgent } from '@dfinity/agent'
import { Principal } from '@dfinity/principal'
import { useAuth } from '@/contexts/auth-context'
import { getConfig, getCanisterIds, validateEnvironment, isSimulationMode } from '@/lib/config'

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

// Mock functions for simulation mode
const createMockActor = (actorType: string) => {
  const mockActor = {
    registerUser: async () => ({ Ok: { id: 'mock-user-id', email: 'test@example.com', role: { Individual: null } } }),
    getMyProfile: async () => ({ Ok: { id: 'mock-user-id', email: 'test@example.com', role: { Individual: null } } }),
    createCredential: async () => ({ Ok: 'mock-credential-id' }),
    getCredentialsByRecipient: async () => [{ id: 'mock-credential-1', title: 'Mock Credential' }],
    submitVerificationRequest: async () => ({ Ok: 'mock-verification-id' }),
    uploadDocument: async () => ({ Ok: 'mock-document-id' }),
  }
  console.log(`Created mock ${actorType} actor for simulation mode`)
  return mockActor
}

const config = getConfig()
const CANISTER_IDS = getCanisterIds()
const HOST = config.IC_HOST

// User Management Hook
export const useUserManagement = () => {
  const { isAuthenticated, identity, principal } = useAuth()
  const [actor, setActor] = useState<UserManagementActor | null>(null)
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isAuthenticated && identity) {
      if (isSimulationMode()) {
        setActor(createMockActor('UserManagement'))
        return
      }
      
      if (userManagementIdl) {
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
    if (isAuthenticated && identity) {
      if (isSimulationMode()) {
        setActor(createMockActor('CredentialNFT'))
        return
      }
      
      if (credentialNftIdl) {
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
    if (isAuthenticated && identity) {
      if (isSimulationMode()) {
        setActor(createMockActor('Verification'))
        return
      }
      
      if (verificationIdl) {
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
    if (isAuthenticated && identity) {
      if (isSimulationMode()) {
        setActor(createMockActor('Storage'))
        return
      }
      
      if (storageIdl) {
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
