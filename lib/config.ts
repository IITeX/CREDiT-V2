// Environment configuration for different deployment stages
export const CONFIG = {
  development: {
    IC_HOST: 'http://localhost:4943',
    ENABLE_DEBUG: true,
    ENABLE_TEST_COMPONENTS: true,
    LOG_LEVEL: 'debug',
    SIMULATION_MODE: false,
  },
  simulation: {
    IC_HOST: 'http://localhost:4943',
    ENABLE_DEBUG: true,
    ENABLE_TEST_COMPONENTS: true,
    LOG_LEVEL: 'debug',
    SIMULATION_MODE: true,
  },
  production: {
    IC_HOST: 'https://ic0.app',
    ENABLE_DEBUG: false,
    ENABLE_TEST_COMPONENTS: false,
    LOG_LEVEL: 'error',
    SIMULATION_MODE: false,
  },
  staging: {
    IC_HOST: 'https://ic0.app',
    ENABLE_DEBUG: true,
    ENABLE_TEST_COMPONENTS: true,
    LOG_LEVEL: 'info',
    SIMULATION_MODE: false,
  }
} as const

export type Environment = keyof typeof CONFIG

export function getConfig(): typeof CONFIG[Environment] {
  const env = (process.env.NODE_ENV || 'development') as Environment
  const simulationMode = process.env.NEXT_PUBLIC_SIMULATION_MODE === 'true'
  const dfxNetwork = process.env.NEXT_PUBLIC_DFX_NETWORK

  // Force production config when using deployed canisters
  if (dfxNetwork === 'ic' || dfxNetwork === 'mainnet') {
    console.log('🔧 Using production config for deployed canisters')
    return CONFIG.production
  }

  if (simulationMode && env === 'development') {
    return CONFIG.simulation
  }

  return CONFIG[env] || CONFIG.development
}

export function isSimulationMode(): boolean {
  return process.env.NEXT_PUBLIC_SIMULATION_MODE === 'true' || getConfig().SIMULATION_MODE
}

export function isProduction(): boolean {
  return process.env.NODE_ENV === 'production'
}

export function isDevelopment(): boolean {
  return process.env.NODE_ENV === 'development'
}

export function getCanisterIds() {
  return {
    // Deployed canisters on IC Network
    credentialNft: process.env.NEXT_PUBLIC_CREDENTIAL_NFT_CANISTER_ID || "k7fau-4yaaa-aaaao-qkb2a-cai",
    storage: process.env.NEXT_PUBLIC_STORAGE_CANISTER_ID || "kyega-raaaa-aaaao-qkb2q-cai",
    internetIdentity: process.env.NEXT_PUBLIC_INTERNET_IDENTITY_CANISTER_ID || "rdmx6-jaaaa-aaaah-qdrha-cai"
  }
}

export function validateEnvironment(): { isValid: boolean; errors: string[] } {
  const errors: string[] = []
  const canisterIds = getCanisterIds()

  // Check if all required canister IDs are present (only deployed canisters)
  if (!canisterIds.credentialNft) {
    errors.push('NEXT_PUBLIC_CREDENTIAL_NFT_CANISTER_ID is not set')
  }

  if (!canisterIds.storage) {
    errors.push('NEXT_PUBLIC_STORAGE_CANISTER_ID is not set')
  }

  if (!canisterIds.internetIdentity) {
    errors.push('NEXT_PUBLIC_INTERNET_IDENTITY_CANISTER_ID is not set')
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}
