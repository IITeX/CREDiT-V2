#!/usr/bin/env node

/**
 * Test script for credential creation workflow
 * Tests the complete process of creating and verifying credentials
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Load environment variables
const envPath = path.join(__dirname, '..', '.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach(line => {
    const [key, value] = line.split('=');
    if (key && value) {
      process.env[key] = value;
    }
  });
}

console.log('🧪 Testing Credential Creation Workflow\n');

async function testCredentialCreation() {
  try {
    console.log('1️⃣ Testing Credential NFT Canister...');
    
    // Test credential creation
    const createCmd = `dfx canister call credential_nft createCredential '(
      variant { Professional },
      "AWS Solutions Architect Certification",
      "Professional certification for cloud architecture and solutions design",
      "cert-admin@aws.com",
      "John Doe",
      record {},
      vec {},
      opt (1735689600000000000)
    )'`;
    
    console.log('   Creating test credential...');
    const createResult = execSync(createCmd, { encoding: 'utf8', cwd: process.cwd() });
    console.log('   ✅ Credential created:', createResult.trim());
    
    // Test getting credentials
    console.log('\n2️⃣ Testing credential retrieval...');
    const getCmd = `dfx canister call credential_nft getCredentials`;
    const getResult = execSync(getCmd, { encoding: 'utf8', cwd: process.cwd() });
    console.log('   ✅ Credentials retrieved:', getResult.trim());
    
    // Test user management
    console.log('\n3️⃣ Testing User Management...');
    const registerCmd = `dfx canister call user_management register '(
      "test@example.com",
      variant { Student }
    )'`;
    
    console.log('   Registering test user...');
    const registerResult = execSync(registerCmd, { encoding: 'utf8', cwd: process.cwd() });
    console.log('   ✅ User registered:', registerResult.trim());
    
    // Test verification
    console.log('\n4️⃣ Testing Verification System...');
    const verifyCmd = `dfx canister call verification getVerificationStatus '(1)'`;
    const verifyResult = execSync(verifyCmd, { encoding: 'utf8', cwd: process.cwd() });
    console.log('   ✅ Verification status:', verifyResult.trim());
    
    console.log('\n🎉 All tests passed! Backend integration is working correctly.');
    
    return true;
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('Full error:', error.toString());
    return false;
  }
}

// Test frontend-backend connection
async function testFrontendConnection() {
  console.log('\n🌐 Testing Frontend Connection...');
  
  try {
    // Check if .env.local exists and has the required canister IDs
    const envPath = path.join(__dirname, '..', '.env.local');
    if (!fs.existsSync(envPath)) {
      throw new Error('.env.local file not found');
    }
    
    const envContent = fs.readFileSync(envPath, 'utf8');
    const requiredVars = [
      'NEXT_PUBLIC_USER_MANAGEMENT_CANISTER_ID',
      'NEXT_PUBLIC_CREDENTIAL_NFT_CANISTER_ID',
      'NEXT_PUBLIC_VERIFICATION_CANISTER_ID',
      'NEXT_PUBLIC_STORAGE_CANISTER_ID',
      'NEXT_PUBLIC_INTERNET_IDENTITY_URL'
    ];
    
    const missingVars = requiredVars.filter(varName => 
      !envContent.includes(varName)
    );
    
    if (missingVars.length > 0) {
      throw new Error(`Missing environment variables: ${missingVars.join(', ')}`);
    }
    
    console.log('   ✅ Environment variables configured');
    
    // Check if declarations are generated
    const declarationsPath = path.join(__dirname, '..', 'src', 'declarations');
    if (!fs.existsSync(declarationsPath)) {
      throw new Error('TypeScript declarations not found. Run ./scripts/generate-types.sh');
    }
    
    const requiredDeclarations = [
      'user_management',
      'credential_nft',
      'verification',
      'storage'
    ];
    
    const missingDeclarations = requiredDeclarations.filter(declaration => 
      !fs.existsSync(path.join(declarationsPath, declaration))
    );
    
    if (missingDeclarations.length > 0) {
      throw new Error(`Missing declarations: ${missingDeclarations.join(', ')}`);
    }
    
    console.log('   ✅ TypeScript declarations generated');
    console.log('   ✅ Frontend is ready for ICP integration');
    
    return true;
  } catch (error) {
    console.error('❌ Frontend connection test failed:', error.message);
    return false;
  }
}

// Main test runner
async function runTests() {
  console.log('🚀 Starting comprehensive integration tests...\n');
  
  const backendTest = await testCredentialCreation();
  const frontendTest = await testFrontendConnection();
  
  if (backendTest && frontendTest) {
    console.log('\n🎉 All integration tests passed!');
    console.log('✅ Backend canisters are functional');
    console.log('✅ Frontend is properly configured');
    console.log('✅ Ready for full end-to-end testing');
    
    console.log('\n📋 Next Steps:');
    console.log('1. Start the frontend: npm run dev');
    console.log('2. Test user registration and credential creation through UI');
    console.log('3. Test credential verification workflow');
    console.log('4. Test admin interface functionality');
  } else {
    console.log('\n❌ Some tests failed. Please check the errors above.');
    process.exit(1);
  }
}

// Run the tests
runTests().catch(console.error);
