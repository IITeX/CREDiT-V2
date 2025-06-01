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
