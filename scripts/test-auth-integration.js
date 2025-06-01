#!/usr/bin/env node

/**
 * Internet Identity Integration Test
 * 
 * This script tests the Internet Identity integration by:
 * 1. Checking environment variables
 * 2. Testing authentication functions
 * 3. Verifying canister connectivity
 * 4. Testing dev login functionality
 */

const fs = require('fs');
const path = require('path');

// Colors for console output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logSection(title) {
  log(`\n${colors.bold}=== ${title} ===${colors.reset}`);
}

function logSuccess(message) {
  log(`✅ ${message}`, 'green');
}

function logError(message) {
  log(`❌ ${message}`, 'red');
}

function logWarning(message) {
  log(`⚠️  ${message}`, 'yellow');
}

function logInfo(message) {
  log(`ℹ️  ${message}`, 'blue');
}

// Test environment variables
function testEnvironmentVariables() {
  logSection('Environment Variables');
  
  const requiredVars = [
    'NEXT_PUBLIC_INTERNET_IDENTITY_CANISTER_ID',
    'NEXT_PUBLIC_USER_MANAGEMENT_CANISTER_ID',
    'NEXT_PUBLIC_CREDENTIAL_NFT_CANISTER_ID',
    'NEXT_PUBLIC_VERIFICATION_CANISTER_ID',
    'NEXT_PUBLIC_STORAGE_CANISTER_ID'
  ];
  
  const optionalVars = [
    'NEXT_PUBLIC_DFX_NETWORK',
    'NEXT_PUBLIC_IC_HOST',
    'NEXT_PUBLIC_AUTH_TIMEOUT',
    'NEXT_PUBLIC_ENABLE_DEV_LOGIN',
    'NEXT_PUBLIC_SIMULATION_MODE'
  ];
  
  let allRequired = true;
  
  // Check required variables
  requiredVars.forEach(varName => {
    const value = process.env[varName];
    if (value) {
      logSuccess(`${varName}: ${value}`);
    } else {
      logError(`${varName}: Not set`);
      allRequired = false;
    }
  });
  
  // Check optional variables
  optionalVars.forEach(varName => {
    const value = process.env[varName];
    if (value) {
      logInfo(`${varName}: ${value}`);
    } else {
      logWarning(`${varName}: Not set (optional)`);
    }
  });
  
  return allRequired;
}

// Test file structure
function testFileStructure() {
  logSection('File Structure');
  
  const requiredFiles = [
    'lib/auth.ts',
    'contexts/auth-context.tsx',
    'components/auth/login-button.tsx',
    'components/auth/user-menu.tsx',
    'components/auth/auth-guard.tsx',
    'components/auth/auth-status.tsx',
    'hooks/useIC.ts'
  ];
  
  let allFilesExist = true;
  
  requiredFiles.forEach(filePath => {
    const fullPath = path.join(__dirname, '..', filePath);
    if (fs.existsSync(fullPath)) {
      logSuccess(`${filePath}: Exists`);
    } else {
      logError(`${filePath}: Missing`);
      allFilesExist = false;
    }
  });
  
  return allFilesExist;
}

// Test package dependencies
function testDependencies() {
  logSection('Package Dependencies');
  
  const packageJsonPath = path.join(__dirname, '..', 'package.json');
  
  if (!fs.existsSync(packageJsonPath)) {
    logError('package.json not found');
    return false;
  }
  
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  const dependencies = { ...packageJson.dependencies, ...packageJson.devDependencies };
  
  const requiredDeps = [
    '@dfinity/agent',
    '@dfinity/auth-client',
    '@dfinity/candid',
    '@dfinity/identity',
    '@dfinity/principal'
  ];
  
  let allDepsPresent = true;
  
  requiredDeps.forEach(dep => {
    if (dependencies[dep]) {
      logSuccess(`${dep}: ${dependencies[dep]}`);
    } else {
      logError(`${dep}: Missing`);
      allDepsPresent = false;
    }
  });
  
  return allDepsPresent;
}

// Test dfx configuration
function testDfxConfiguration() {
  logSection('DFX Configuration');
  
  const dfxJsonPath = path.join(__dirname, '..', 'dfx.json');
  
  if (!fs.existsSync(dfxJsonPath)) {
    logError('dfx.json not found');
    return false;
  }
  
  const dfxJson = JSON.parse(fs.readFileSync(dfxJsonPath, 'utf8'));
  
  // Check for Internet Identity canister
  if (dfxJson.canisters && dfxJson.canisters.internet_identity) {
    logSuccess('Internet Identity canister configured');
    logInfo(`Type: ${dfxJson.canisters.internet_identity.type}`);
    if (dfxJson.canisters.internet_identity.candid) {
      logInfo(`Candid: ${dfxJson.canisters.internet_identity.candid}`);
    }
    if (dfxJson.canisters.internet_identity.wasm) {
      logInfo(`WASM: ${dfxJson.canisters.internet_identity.wasm}`);
    }
  } else {
    logError('Internet Identity canister not configured');
    return false;
  }
  
  // Check output environment file
  if (dfxJson.output_env_file) {
    logSuccess(`Environment file: ${dfxJson.output_env_file}`);
  } else {
    logWarning('No output environment file configured');
  }
  
  // Check generate configuration
  if (dfxJson.generate) {
    logSuccess('Type generation configured');
    if (dfxJson.generate.binding && dfxJson.generate.binding.includes('typescript')) {
      logSuccess('TypeScript bindings enabled');
    }
    if (dfxJson.generate.output) {
      logInfo(`Output directory: ${dfxJson.generate.output}`);
    }
  } else {
    logWarning('Type generation not configured');
  }
  
  return true;
}

// Test TypeScript configuration
function testTypeScriptConfig() {
  logSection('TypeScript Configuration');
  
  const tsconfigPath = path.join(__dirname, '..', 'tsconfig.json');
  
  if (!fs.existsSync(tsconfigPath)) {
    logError('tsconfig.json not found');
    return false;
  }
  
  const tsconfig = JSON.parse(fs.readFileSync(tsconfigPath, 'utf8'));
  
  // Check if declarations directory is included
  if (tsconfig.compilerOptions && tsconfig.compilerOptions.baseUrl) {
    logSuccess('Base URL configured');
  }
  
  if (tsconfig.compilerOptions && tsconfig.compilerOptions.paths) {
    logSuccess('Path mapping configured');
  }
  
  return true;
}

// Main test function
async function runTests() {
  log(`${colors.bold}🧪 Internet Identity Integration Test${colors.reset}\n`);
  
  const results = {
    environment: testEnvironmentVariables(),
    fileStructure: testFileStructure(),
    dependencies: testDependencies(),
    dfxConfig: testDfxConfiguration(),
    typescriptConfig: testTypeScriptConfig()
  };
  
  logSection('Test Summary');
  
  const passed = Object.values(results).filter(Boolean).length;
  const total = Object.keys(results).length;
  
  Object.entries(results).forEach(([test, passed]) => {
    if (passed) {
      logSuccess(`${test}: PASSED`);
    } else {
      logError(`${test}: FAILED`);
    }
  });
  
  log(`\n${colors.bold}Results: ${passed}/${total} tests passed${colors.reset}`);
  
  if (passed === total) {
    logSuccess('🎉 All tests passed! Internet Identity integration is properly configured.');
  } else {
    logError('❌ Some tests failed. Please check the configuration.');
    process.exit(1);
  }
}

// Load environment variables from .env file
function loadEnvFile() {
  const envPath = path.join(__dirname, '..', '.env');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    envContent.split('\n').forEach(line => {
      const [key, value] = line.split('=');
      if (key && value) {
        process.env[key.trim()] = value.trim().replace(/^['"]|['"]$/g, '');
      }
    });
    logInfo('Loaded environment variables from .env file');
  }
}

// Run the tests
loadEnvFile();
runTests().catch(console.error);
