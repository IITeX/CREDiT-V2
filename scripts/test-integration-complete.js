#!/usr/bin/env node

/**
 * Complete Integration Test Script for dresumeV2
 * Tests both frontend and backend connectivity
 */

const http = require('http');
const https = require('https');

// Colors for console output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

function makeRequest(url, timeout = 5000) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    const req = client.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, data }));
    });
    
    req.setTimeout(timeout, () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });
    
    req.on('error', reject);
  });
}

async function testEndpoint(name, url, expectedStatus = 200) {
  try {
    log(`Testing ${name}...`, colors.blue);
    const result = await makeRequest(url);
    
    if (result.status === expectedStatus) {
      log(`✅ ${name}: SUCCESS (${result.status})`, colors.green);
      return true;
    } else {
      log(`❌ ${name}: FAILED (${result.status})`, colors.red);
      return false;
    }
  } catch (error) {
    log(`❌ ${name}: ERROR - ${error.message}`, colors.red);
    return false;
  }
}

async function testCanister(name, canisterId, host = 'http://localhost:4943') {
  const url = `${host}/?canisterId=ucwa4-rx777-77774-qaada-cai&id=${canisterId}`;
  return await testEndpoint(`${name} Canister`, url);
}

async function runTests() {
  log('\n🚀 Starting Complete Integration Tests for dresumeV2\n', colors.bold + colors.blue);
  
  const results = {
    frontend: [],
    backend: [],
    canisters: []
  };

  // Test Frontend
  log('📱 Testing Frontend Services', colors.bold + colors.yellow);
  results.frontend.push(await testEndpoint('Next.js Dev Server', 'http://localhost:3000'));
  results.frontend.push(await testEndpoint('Dashboard Page', 'http://localhost:3000/dashboard'));
  results.frontend.push(await testEndpoint('Auth Page', 'http://localhost:3000/auth'));
  
  // Test DFX Replica
  log('\n🔧 Testing DFX Replica', colors.bold + colors.yellow);
  results.backend.push(await testEndpoint('DFX Replica', 'http://localhost:4943'));
  
  // Test Individual Canisters
  log('\n📦 Testing Individual Canisters', colors.bold + colors.yellow);
  const canisterIds = {
    'User Management': 'umunu-kh777-77774-qaaca-cai',
    'Credential NFT': 'uxrrr-q7777-77774-qaaaq-cai',
    'Verification': 'ulvla-h7777-77774-qaacq-cai',
    'Storage': 'uzt4z-lp777-77774-qaabq-cai',
    'Internet Identity': 'u6s2n-gx777-77774-qaaba-cai'
  };

  for (const [name, id] of Object.entries(canisterIds)) {
    results.canisters.push(await testCanister(name, id));
  }

  // Summary
  log('\n📊 Test Results Summary', colors.bold + colors.blue);
  log('='.repeat(50), colors.blue);
  
  const frontendPassed = results.frontend.filter(Boolean).length;
  const backendPassed = results.backend.filter(Boolean).length;
  const canistersPassed = results.canisters.filter(Boolean).length;
  
  log(`Frontend: ${frontendPassed}/${results.frontend.length} tests passed`, 
    frontendPassed === results.frontend.length ? colors.green : colors.red);
  log(`Backend: ${backendPassed}/${results.backend.length} tests passed`, 
    backendPassed === results.backend.length ? colors.green : colors.red);
  log(`Canisters: ${canistersPassed}/${results.canisters.length} tests passed`, 
    canistersPassed === results.canisters.length ? colors.green : colors.red);
  
  const totalPassed = frontendPassed + backendPassed + canistersPassed;
  const totalTests = results.frontend.length + results.backend.length + results.canisters.length;
  
  log(`\nOverall: ${totalPassed}/${totalTests} tests passed`, 
    totalPassed === totalTests ? colors.green : colors.red);
  
  if (totalPassed === totalTests) {
    log('\n🎉 All integration tests passed! System is ready for use.', colors.bold + colors.green);
  } else {
    log('\n⚠️  Some tests failed. Please check the system configuration.', colors.bold + colors.yellow);
  }

  // Next Steps
  log('\n📋 Next Steps:', colors.bold + colors.blue);
  log('1. Open http://localhost:3000 in your browser');
  log('2. Navigate to /dashboard to see the IC Integration Tester');
  log('3. Authenticate with Internet Identity');
  log('4. Run the integration tests in the browser');
  log('5. Test credential creation and management features');
  
  return totalPassed === totalTests;
}

if (require.main === module) {
  runTests().then(success => {
    process.exit(success ? 0 : 1);
  }).catch(error => {
    log(`Fatal error: ${error.message}`, colors.red);
    process.exit(1);
  });
}

module.exports = { runTests, testEndpoint, testCanister };
