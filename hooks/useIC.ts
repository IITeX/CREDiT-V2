import { useState, useEffect, useCallback } from 'react'
import { Actor, HttpAgent } from '@dfinity/agent'
import { Principal } from '@dfinity/principal'
import { useInternetIdentity } from '@/hooks/useInternetIdentity'
import { getConfig, getCanisterIds, validateEnvironment, isSimulationMode } from '@/lib/config'
import {
  createCredentialNFTActor,
  createStorageActor,
  handleCanisterError,
  checkCanisterHealth,
  getCanisterUrls
} from '@/lib/canister-utils'

// Import generated declarations for deployed canisters
let credentialNftIdl: any, storageIdl: any

try {
  // Import generated declarations for deployed canisters
  credentialNftIdl = require('../src/declarations/credential_nft').idlFactory
  storageIdl = require('../src/declarations/storage').idlFactory
  console.log('✅ Successfully loaded canister declarations')
} catch (e) {
  console.error('❌ Failed to load canister declarations:', e)
  console.warn('Using fallback types - some functionality may be limited')
}

// Types for when declarations are not available
type CredentialNFTActor = any
type StorageActor = any

// Mock functions for simulation mode
const createMockActor = (actorType: string) => {
  const generateTokenId = () => {
    const types = ['CS', 'WE', 'ED', 'AC', 'PR', 'SK']
    const type = types[Math.floor(Math.random() * types.length)]
    const year = new Date().getFullYear()
    const num = String(Math.floor(Math.random() * 1000)).padStart(3, '0')
    return `${type}-${year}-${num}`
  }

  const createMockCredential = (title = 'Mock AWS Solutions Architect') => ({
    id: 'mock-credential-' + Date.now(),
    title,
    description: 'Mock professional cloud architecture certification',
    tokenId: generateTokenId(),
    issuer: 'mock-issuer-principal',
    recipient: 'mock-recipient',
    recipientName: 'Mock User',
    issuedAt: BigInt(Date.now() * 1000000),
    expiresAt: [],
    isRevoked: false,
    credentialType: { Certification: null },
    metadata: [
      ['issuer', 'Amazon Web Services'],
      ['date', new Date().toISOString().split('T')[0]],
      ['type', 'certificate']
    ],
    documentHash: [],
    blockchainTxId: []
  })

  const createMockNFT = (credential: any) => ({
    tokenId: credential.tokenId,
    owner: 'mock-owner-principal',
    createdAt: BigInt(Date.now() * 1000000),
    metadata: {
      name: credential.title,
      description: credential.description,
      image: 'https://example.com/credential.png',
      credentialId: credential.id,
      issuer: 'Amazon Web Services',
      recipient: credential.recipientName,
      issuedAt: credential.issuedAt,
      attributes: [
        ['type', 'Certification'],
        ['level', 'Professional']
      ]
    }
  })

  const mockActor = {
    registerUser: async () => ({ Ok: { id: 'mock-user-id', email: 'admin@dresume.app', role: { Company: null }, verificationStatus: { Approved: null } } }),
    getMyProfile: async () => ({ Ok: { id: 'mock-user-id', email: 'admin@dresume.app', role: { Company: null }, verificationStatus: { Approved: null } } }),
    createCredential: async (credentialType: any, title: string) => {
      const credential = createMockCredential(title)
      const nft = createMockNFT(credential)
      console.log('Mock credential created with token ID:', credential.tokenId)
      return { Ok: [credential, nft] }
    },
    createSoulBoundToken: async (credentialType: any, title: string) => {
      const credential = createMockCredential(title)
      const nft = createMockNFT(credential)
      console.log('Mock Soul Bound Token created with token ID:', credential.tokenId)
      return { Ok: [credential, nft] }
    },
    getCredentialsByIssuer: async () => [createMockCredential()],
    getCredentialsByRecipient: async () => [createMockCredential()],
    getCredentialByToken: async (tokenId: string) => {
      if (tokenId.match(/^[A-Z]{2}-\d{4}-\d{3}$/)) {
        const credential = createMockCredential()
        credential.tokenId = tokenId
        return { Ok: credential }
      }
      return { Err: { NotFound: null } }
    },
    getNFT: async (tokenId: string) => {
      if (tokenId.match(/^[A-Z]{2}-\d{4}-\d{3}$/)) {
        const credential = createMockCredential()
        credential.tokenId = tokenId
        const nft = createMockNFT(credential)
        return { Ok: nft }
      }
      return { Err: { NotFound: null } }
    },
    searchCredentials: async () => [createMockCredential()],
    submitVerificationRequest: async () => ({ Ok: 'mock-verification-id' }),
    uploadDocument: async () => ({ Ok: 'mock-document-id' }),
    updateVerificationStatus: async () => ({ Ok: 'mock-status-update' }),
  }
  console.log(`Created mock ${actorType} actor for simulation mode`)
  return mockActor
}

const config = getConfig()
const CANISTER_IDS = getCanisterIds()
const HOST = config.IC_HOST

// User Management Hook - Now uses Storage Canister
export const useUserManagement = () => {
  const { isAuthenticated, identity, principal } = useInternetIdentity()
  const [actor, setActor] = useState<StorageActor | null>(null)
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isAuthenticated && identity) {
      // Only use simulation mode if explicitly enabled
      if (isSimulationMode()) {
        console.log('🔧 Using mock actor for user management (simulation mode)')
        setActor(createMockActor('Storage'))
        return
      }

      try {
        console.log('🔧 Creating storage actor with enhanced utilities')
        const actor = createStorageActor(identity)
        setActor(actor)
        console.log('✅ Storage actor created successfully with enhanced utilities')

        // Validate connection
        checkCanisterHealth(identity).then(health => {
          if (!health.storage) {
            console.error('❌ Storage canister health check failed:', health.errors)
          } else {
            console.log('✅ Storage canister is healthy')
          }
        })

      } catch (error) {
        console.error('❌ Failed to create storage actor:', error)
        setActor(null)
      }
    } else {
      setActor(null)
      console.log('🔧 User not authenticated, clearing storage actor')
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

  const updateVerificationStatus = useCallback(async (
    userPrincipal: string,
    status: any
  ) => {
    if (!actor) throw new Error('Not authenticated')
    setLoading(true)
    try {
      const result = await actor.updateUserVerificationStatus(
        Principal.fromText(userPrincipal),
        status
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

  const getAllUsers = useCallback(async () => {
    if (!actor) throw new Error('Not authenticated')
    setLoading(true)
    try {
      const result = await actor.getAllUsers()
      return result
    } finally {
      setLoading(false)
    }
  }, [actor])

  return { user, registerUser, getMyProfile, updateVerificationStatus, getAllUsers, loading }
}

// Credentials Hook
export const useCredentials = () => {
  const { isAuthenticated, identity, principal } = useInternetIdentity()
  const [actor, setActor] = useState<CredentialNFTActor | null>(null)
  const [credentials, setCredentials] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isAuthenticated && identity) {
      // Only use simulation mode if explicitly enabled
      if (isSimulationMode()) {
        console.log('🔧 Using mock actor for credentials (simulation mode)')
        setActor(createMockActor('CredentialNFT'))
        return
      }

      try {
        console.log('🔧 Creating credentials actor with enhanced utilities')
        const actor = createCredentialNFTActor(identity)
        setActor(actor)
        console.log('✅ Credential NFT actor created successfully with enhanced utilities')

        // Validate connection
        checkCanisterHealth(identity).then(health => {
          if (!health.credentialNft) {
            console.error('❌ Credential NFT canister health check failed:', health.errors)
          } else {
            console.log('✅ Credential NFT canister is healthy')
          }
        })

      } catch (error) {
        console.error('❌ Failed to create credential NFT actor:', error)
        setActor(null)
      }
    } else {
      setActor(null)
      console.log('🔧 User not authenticated, clearing credentials actor')
    }
  }, [isAuthenticated, identity])

  // Define getMyCredentials first since it's used by other functions
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

  const createCredential = useCallback(async (
    credentialType: any,
    title: string,
    description: string,
    recipient: string,
    recipientName: string,
    metadata: any = {},
    documentHash: any[] = [],
    expiresAt: any[] = []
  ) => {
    if (!actor) {
      console.error('❌ No actor available for credential creation')
      throw new Error('Not authenticated - please login with Internet Identity first')
    }

    console.log('🔄 Creating credential with data:', {
      credentialType,
      title,
      description,
      recipient,
      recipientName,
      metadata,
      canisterId: CANISTER_IDS.credentialNft
    })

    setLoading(true)
    try {
      // Convert metadata to array of tuples format expected by canister
      const metadataArray = Object.entries(metadata)
      console.log('📝 Metadata array:', metadataArray)

      console.log('🚀 Calling createCredential on canister...')
      const result = await actor.createCredential(
        credentialType,
        title,
        description,
        recipient,
        recipientName,
        expiresAt,
        metadataArray,
        documentHash.length > 0 ? [documentHash[0]] : []
      )

      console.log('📥 Received result from canister:', result)

      if ('Ok' in result) {
        console.log('✅ Credential and NFT created successfully:', result.Ok)
        // result.Ok contains [Credential, NFT] tuple
        const [credential, nft] = result.Ok
        console.log('📄 Credential:', credential)
        console.log('🎫 NFT Token ID:', nft.tokenId)

        // Refresh credentials list
        console.log('🔄 Refreshing credentials list...')
        await getMyCredentials()

        return {
          credential,
          nft,
          tokenId: nft.tokenId,           // For NFT operations (CREDiT-1)
          credentialId: credential.id     // For credential operations (SK-1749407266732902981)
        }
      } else {
        console.error('❌ Failed to create credential:', result.Err)
        const errorKey = Object.keys(result.Err)[0]
        const errorValue = result.Err[errorKey]
        throw new Error(`Canister error: ${errorKey}${errorValue ? ` - ${errorValue}` : ''}`)
      }
    } catch (error) {
      console.error('❌ Error creating credential:', error)

      // Use enhanced error handling
      const enhancedError = handleCanisterError(error, 'credential creation')
      throw enhancedError
    } finally {
      setLoading(false)
    }
  }, [actor, getMyCredentials])

  const createSoulBoundToken = useCallback(async (
    credentialType: any,
    title: string,
    description: string,
    recipient: string,
    recipientName: string,
    issuerRole: string,
    metadata: any = {},
    documentHash: any[] = [],
    expiresAt: any[] = []
  ) => {
    if (!actor) throw new Error('Not authenticated')
    setLoading(true)
    try {
      // Convert metadata to array of tuples format expected by canister
      const metadataArray = Object.entries(metadata)

      const result = await actor.createSoulBoundToken(
        credentialType,
        title,
        description,
        recipient,
        recipientName,
        issuerRole,
        expiresAt,
        metadataArray,
        documentHash.length > 0 ? [documentHash[0]] : []
      )

      if ('Ok' in result) {
        console.log('Soul Bound Token created successfully:', result.Ok)
        // result.Ok contains [Credential, NFT] tuple
        const [credential, nft] = result.Ok
        console.log('SBT Credential:', credential)
        console.log('SBT Token ID:', nft.tokenId)

        // Refresh credentials list
        await getMyCredentials()
        return {
          credential,
          nft,
          tokenId: nft.tokenId,           // For NFT operations (ED-2025-001)
          credentialId: credential.id     // For credential operations (SK-1749407266732902981)
        }
      } else {
        console.error('Failed to create Soul Bound Token:', result.Err)
        throw new Error(Object.keys(result.Err)[0])
      }
    } catch (error) {
      console.error('Error creating Soul Bound Token:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }, [actor, getMyCredentials])

  const getCredentialsByIssuer = useCallback(async (issuerPrincipal?: string) => {
    if (!actor) throw new Error('Not authenticated')
    setLoading(true)
    try {
      // Use provided principal or current user's principal
      const issuer = issuerPrincipal || (principal ? principal.toText() : null)
      if (!issuer) throw new Error('No issuer principal provided')

      const result = await actor.getCredentialsByIssuer(issuer)
      console.log('Credentials by issuer:', result)
      return result
    } catch (error) {
      console.error('Error getting credentials by issuer:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }, [actor, principal])

  const getCredentialByToken = useCallback(async (tokenId: string) => {
    if (!actor) throw new Error('Not authenticated')
    setLoading(true)
    try {
      const result = await actor.getCredentialByToken(tokenId)

      if ('Ok' in result) {
        console.log('Credential found by token:', result.Ok)
        return result.Ok
      } else {
        console.error('Credential not found:', result.Err)
        return null
      }
    } catch (error) {
      console.error('Error getting credential by token:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }, [actor])

  const getCredentialById = useCallback(async (credentialId: string) => {
    if (!actor) throw new Error('Not authenticated')
    setLoading(true)
    try {
      const result = await actor.getCredential(credentialId)

      if ('Ok' in result) {
        console.log('Credential found by ID:', result.Ok)
        return result.Ok
      } else {
        console.error('Credential not found:', result.Err)
        return null
      }
    } catch (error) {
      console.error('Error getting credential by ID:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }, [actor])

  const searchCredentials = useCallback(async (filter: any = {}) => {
    if (!actor) throw new Error('Not authenticated')
    setLoading(true)
    try {
      const result = await actor.searchCredentials(filter)
      console.log('Search results:', result)
      return result
    } catch (error) {
      console.error('Error searching credentials:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }, [actor])

  const getNFT = useCallback(async (tokenId: string) => {
    if (!actor) throw new Error('Not authenticated')
    setLoading(true)
    try {
      const result = await actor.getNFT(tokenId)

      if ('Ok' in result) {
        console.log('NFT found:', result.Ok)
        return result.Ok
      } else {
        console.error('NFT not found:', result.Err)
        return null
      }
    } catch (error) {
      console.error('Error getting NFT:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }, [actor])

  return {
    credentials,
    createCredential,
    createSoulBoundToken,
    getMyCredentials,
    getCredentialsByIssuer,
    getCredentialByToken,    // Use with tokenId (CREDiT-1, ED-2025-001)
    getCredentialById,       // Use with credentialId (SK-1749407266732902981)
    searchCredentials,
    getNFT,                  // Use with tokenId (CREDiT-1, ED-2025-001)
    loading
  }
}

// Verification Hook - Now uses Storage Canister
export const useVerification = () => {
  const { isAuthenticated, identity } = useInternetIdentity()
  const [actor, setActor] = useState<StorageActor | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isAuthenticated && identity) {
      if (isSimulationMode()) {
        console.log('🔧 Using mock actor for verification (simulation mode)')
        setActor(createMockActor('Storage'))
        return
      }

      if (storageIdl) {
        console.log('🔧 Creating real storage actor with identity for verification')
        const agent = new HttpAgent({ host: HOST, identity })

        // Only fetch root key for local development
        if (process.env.NEXT_PUBLIC_DFX_NETWORK === 'local') {
          agent.fetchRootKey().catch(console.error)
        }

        const actor = Actor.createActor(storageIdl, {
          agent,
          canisterId: CANISTER_IDS.storage,
        })
        setActor(actor)
      }
    } else {
      setActor(null)
    }
  }, [isAuthenticated, identity])

  const submitVerificationRequest = useCallback(async (
    role: any,
    organizationName: string,
    documentHashes: string[]
  ) => {
    if (!actor) throw new Error('Not authenticated')
    setLoading(true)
    try {
      const result = await actor.submitVerificationRequest(
        role,
        organizationName,
        documentHashes
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

  const getMyVerificationRequests = useCallback(async () => {
    if (!actor) throw new Error('Not authenticated')
    setLoading(true)
    try {
      const result = await actor.getMyVerificationRequests()
      return result
    } finally {
      setLoading(false)
    }
  }, [actor])

  const getPendingVerificationRequests = useCallback(async () => {
    if (!actor) throw new Error('Not authenticated')
    setLoading(true)
    try {
      const result = await actor.getPendingVerificationRequests()
      if ('Ok' in result) {
        return result.Ok
      } else {
        throw new Error(Object.keys(result.Err)[0])
      }
    } finally {
      setLoading(false)
    }
  }, [actor])

  const reviewVerificationRequest = useCallback(async (
    requestId: string,
    status: any,
    notes?: string
  ) => {
    if (!actor) throw new Error('Not authenticated')
    setLoading(true)
    try {
      const result = await actor.reviewVerificationRequest(
        requestId,
        status,
        notes ? [notes] : []
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

  return {
    submitVerificationRequest,
    getMyVerificationRequests,
    getPendingVerificationRequests,
    reviewVerificationRequest,
    loading
  }
}

// Storage Hook
export const useStorage = () => {
  const { isAuthenticated, identity } = useInternetIdentity()
  const [actor, setActor] = useState<StorageActor | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isAuthenticated && identity) {
      if (isSimulationMode()) {
        console.log('🔧 Using mock actor for storage (simulation mode)')
        setActor(createMockActor('Storage'))
        return
      }

      if (storageIdl) {
        console.log('🔧 Creating real storage actor with identity')
        const agent = new HttpAgent({ host: HOST, identity })

        // Only fetch root key for local development
        if (process.env.NEXT_PUBLIC_DFX_NETWORK === 'local') {
          agent.fetchRootKey().catch(console.error)
        }

        const actor = Actor.createActor(storageIdl, {
          agent,
          canisterId: CANISTER_IDS.storage,
        })
        setActor(actor)
      }
    } else {
      setActor(null)
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
