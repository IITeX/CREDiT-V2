/**
 * Canister Utilities for IC Network Integration
 * Handles proper connection to deployed canisters with CORS and authentication
 */

import { Actor, HttpAgent, Identity } from '@dfinity/agent'
import { Principal } from '@dfinity/principal'
import { getConfig, getCanisterIds } from '@/lib/config'

// Import IDL factories
let credentialNftIdl: any, storageIdl: any

try {
  credentialNftIdl = require('../src/declarations/credential_nft').idlFactory
  storageIdl = require('../src/declarations/storage').idlFactory
  console.log('✅ Canister IDL factories loaded successfully')
} catch (e) {
  console.error('❌ Failed to load canister IDL factories:', e)
}

const config = getConfig()
const CANISTER_IDS = getCanisterIds()

/**
 * Creates an HTTP Agent with proper configuration for IC Network
 * Always uses deployed canisters on IC mainnet
 */
export function createICAgent(identity?: Identity): HttpAgent {
  // Force IC mainnet since canisters are deployed there
  const host = 'https://ic0.app'

  console.log('🔧 Creating IC Agent for deployed canisters with host:', host)
  console.log('🔧 Using deployed canister IDs:', CANISTER_IDS)

  const agentOptions: any = {
    host,
    ...(identity && { identity })
  }

  // Production IC Network configuration
  agentOptions.verifyQuerySignatures = false

  // Add proper CORS configuration for IC Network
  agentOptions.fetch = (input: RequestInfo | URL, init?: RequestInit) => {
    const headers = {
      'Content-Type': 'application/cbor',
      'Accept': 'application/cbor',
      ...init?.headers
    }

    return fetch(input, {
      ...init,
      headers,
      mode: 'cors',
      credentials: 'omit',
      cache: 'no-cache'
    })
  }

  const agent = new HttpAgent(agentOptions)

  // Never fetch root key for deployed canisters (production only)
  console.log('🔧 Using deployed canisters - skipping root key fetch')

  return agent
}

/**
 * Creates a Credential NFT actor with proper error handling
 */
export function createCredentialNFTActor(identity?: Identity): any {
  if (!credentialNftIdl) {
    throw new Error('Credential NFT IDL not available')
  }

  const agent = createICAgent(identity)
  
  console.log('🔧 Creating Credential NFT actor with canister ID:', CANISTER_IDS.credentialNft)
  
  const actor = Actor.createActor(credentialNftIdl, {
    agent,
    canisterId: CANISTER_IDS.credentialNft,
  })

  return actor
}

/**
 * Creates a Storage actor with proper error handling
 */
export function createStorageActor(identity?: Identity): any {
  if (!storageIdl) {
    throw new Error('Storage IDL not available')
  }

  const agent = createICAgent(identity)
  
  console.log('🔧 Creating Storage actor with canister ID:', CANISTER_IDS.storage)
  
  const actor = Actor.createActor(storageIdl, {
    agent,
    canisterId: CANISTER_IDS.storage,
  })

  return actor
}

/**
 * Validates canister connection by making a simple query
 */
export async function validateCanisterConnection(actor: any, canisterType: string): Promise<boolean> {
  try {
    console.log(`🔍 Validating ${canisterType} canister connection...`)
    
    // Try a simple query method that should exist on all canisters
    if (canisterType === 'credential_nft') {
      // Try to get a non-existent credential to test connection
      await actor.getCredentialByToken('test-connection')
    } else if (canisterType === 'storage') {
      // Try to get profile to test connection
      await actor.getMyProfile()
    }
    
    console.log(`✅ ${canisterType} canister connection validated`)
    return true
  } catch (error) {
    console.error(`❌ ${canisterType} canister connection failed:`, error)
    
    // Check for specific error types
    if (error instanceof Error) {
      if (error.message.includes('Call failed')) {
        console.error('Network or CORS error - check canister deployment and network configuration')
      } else if (error.message.includes('Unauthorized')) {
        console.error('Authentication error - user may need to login')
      } else if (error.message.includes('NotFound')) {
        console.log('Connection successful (NotFound is expected for test query)')
        return true
      }
    }
    
    return false
  }
}

/**
 * Comprehensive canister health check
 */
export async function checkCanisterHealth(identity?: Identity): Promise<{
  credentialNft: boolean
  storage: boolean
  errors: string[]
}> {
  const errors: string[] = []
  let credentialNftHealthy = false
  let storageHealthy = false

  try {
    // Test Credential NFT canister
    const credentialActor = createCredentialNFTActor(identity)
    credentialNftHealthy = await validateCanisterConnection(credentialActor, 'credential_nft')
    
    if (!credentialNftHealthy) {
      errors.push('Credential NFT canister connection failed')
    }
  } catch (error) {
    errors.push(`Credential NFT canister error: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }

  try {
    // Test Storage canister
    const storageActor = createStorageActor(identity)
    storageHealthy = await validateCanisterConnection(storageActor, 'storage')
    
    if (!storageHealthy) {
      errors.push('Storage canister connection failed')
    }
  } catch (error) {
    errors.push(`Storage canister error: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }

  return {
    credentialNft: credentialNftHealthy,
    storage: storageHealthy,
    errors
  }
}

/**
 * Get canister URLs for debugging
 */
export function getCanisterUrls() {
  return {
    credentialNft: `https://a4gq6-oaaaa-aaaab-qaa4q-cai.icp0.io/?id=${CANISTER_IDS.credentialNft}`,
    storage: `https://a4gq6-oaaaa-aaaab-qaa4q-cai.icp0.io/?id=${CANISTER_IDS.storage}`,
    canisterIds: CANISTER_IDS,
    host: config.IC_HOST
  }
}

/**
 * Error handler for canister calls
 */
export function handleCanisterError(error: any, operation: string): Error {
  console.error(`❌ Canister error during ${operation}:`, error)
  
  if (error instanceof Error) {
    if (error.message.includes('Call failed')) {
      return new Error(`Network error during ${operation}. Please check your internet connection and try again.`)
    } else if (error.message.includes('Unauthorized')) {
      return new Error(`Authentication required for ${operation}. Please login with Internet Identity.`)
    } else if (error.message.includes('CORS')) {
      return new Error(`Network configuration error during ${operation}. Please refresh the page and try again.`)
    } else if (error.message.includes('NotFound')) {
      return new Error(`Resource not found during ${operation}.`)
    }
  }
  
  return new Error(`Error during ${operation}: ${error instanceof Error ? error.message : 'Unknown error'}`)
}
