#!/usr/bin/env node

/**
 * Test Internet Identity Connection
 * This script helps debug Internet Identity connection issues
 */

const https = require('https');
const http = require('http');

// Configuration
const PRODUCTION_II_URL = 'https://identity.ic0.app';
const PRODUCTION_IC_HOST = 'https://ic0.app';
const DEPLOYED_DOMAIN = 'https://credit.zaide.online';

console.log('🔍 Testing Internet Identity Connection...\n');

// Test 1: Check if Internet Identity is accessible
async function testInternetIdentityAccess() {
  console.log('1️⃣ Testing Internet Identity accessibility...');
  
  return new Promise((resolve) => {
    const req = https.get(PRODUCTION_II_URL, (res) => {
      console.log(`   ✅ Internet Identity accessible: ${res.statusCode}`);
      resolve(true);
    });
    
    req.on('error', (err) => {
      console.log(`   ❌ Internet Identity not accessible: ${err.message}`);
      resolve(false);
    });
    
    req.setTimeout(5000, () => {
      console.log('   ❌ Internet Identity request timeout');
      req.destroy();
      resolve(false);
    });
  });
}

// Test 2: Check IC Network connectivity
async function testICNetworkAccess() {
  console.log('\n2️⃣ Testing IC Network connectivity...');
  
  return new Promise((resolve) => {
    const req = https.get(PRODUCTION_IC_HOST + '/api/v2/status', (res) => {
      console.log(`   ✅ IC Network accessible: ${res.statusCode}`);
      resolve(true);
    });
    
    req.on('error', (err) => {
      console.log(`   ❌ IC Network not accessible: ${err.message}`);
      resolve(false);
    });
    
    req.setTimeout(5000, () => {
      console.log('   ❌ IC Network request timeout');
      req.destroy();
      resolve(false);
    });
  });
}

// Test 3: Check deployed domain accessibility
async function testDeployedDomain() {
  console.log('\n3️⃣ Testing deployed domain accessibility...');
  
  return new Promise((resolve) => {
    const req = https.get(DEPLOYED_DOMAIN, (res) => {
      console.log(`   ✅ Deployed domain accessible: ${res.statusCode}`);
      resolve(true);
    });
    
    req.on('error', (err) => {
      console.log(`   ❌ Deployed domain not accessible: ${err.message}`);
      resolve(false);
    });
    
    req.setTimeout(5000, () => {
      console.log('   ❌ Deployed domain request timeout');
      req.destroy();
      resolve(false);
    });
  });
}

// Test 4: Check canister accessibility
async function testCanisterAccess() {
  console.log('\n4️⃣ Testing canister accessibility...');
  
  const canisters = [
    { name: 'Credentials', id: 'k7fau-4yaaa-aaaao-qkb2a-cai' },
    { name: 'Storage', id: 'kyega-raaaa-aaaao-qkb2q-cai' }
  ];
  
  for (const canister of canisters) {
    const url = `${PRODUCTION_IC_HOST}/api/v2/canister/${canister.id}/query`;
    
    await new Promise((resolve) => {
      const req = https.get(url, (res) => {
        console.log(`   ✅ ${canister.name} canister accessible: ${res.statusCode}`);
        resolve(true);
      });
      
      req.on('error', (err) => {
        console.log(`   ❌ ${canister.name} canister not accessible: ${err.message}`);
        resolve(false);
      });
      
      req.setTimeout(3000, () => {
        console.log(`   ❌ ${canister.name} canister request timeout`);
        req.destroy();
        resolve(false);
      });
    });
  }
}

// Main test function
async function runTests() {
  console.log('🚀 Starting Internet Identity Connection Tests\n');
  
  const results = {
    internetIdentity: await testInternetIdentityAccess(),
    icNetwork: await testICNetworkAccess(),
    deployedDomain: await testDeployedDomain()
  };
  
  await testCanisterAccess();
  
  console.log('\n📊 Test Results Summary:');
  console.log('========================');
  console.log(`Internet Identity: ${results.internetIdentity ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`IC Network: ${results.icNetwork ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Deployed Domain: ${results.deployedDomain ? '✅ PASS' : '❌ FAIL'}`);
  
  if (results.internetIdentity && results.icNetwork && results.deployedDomain) {
    console.log('\n🎉 All basic connectivity tests passed!');
    console.log('\n💡 If Internet Identity still fails, the issue might be:');
    console.log('   1. CORS configuration');
    console.log('   2. Derivation origin mismatch');
    console.log('   3. Browser security settings');
    console.log('   4. Internet Identity canister configuration');
  } else {
    console.log('\n⚠️  Some connectivity tests failed. Check network connectivity.');
  }
  
  console.log('\n🔧 Debugging Tips:');
  console.log('==================');
  console.log('1. Check browser console for detailed error messages');
  console.log('2. Verify the deployed domain matches the configured origin');
  console.log('3. Ensure HTTPS is properly configured');
  console.log('4. Try clearing browser cache and cookies');
  console.log('5. Test in incognito/private browsing mode');
}

// Run the tests
runTests().catch(console.error);
