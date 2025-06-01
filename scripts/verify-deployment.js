// Simple deployment verification script
console.log('🚀 Deployment Verification');
console.log('==========================');

// Check environment variables
console.log('\n📋 Environment Variables:');
console.log('USER_MANAGEMENT_CANISTER_ID:', process.env.NEXT_PUBLIC_USER_MANAGEMENT_CANISTER_ID);
console.log('CREDENTIAL_NFT_CANISTER_ID:', process.env.NEXT_PUBLIC_CREDENTIAL_NFT_CANISTER_ID);
console.log('VERIFICATION_CANISTER_ID:', process.env.NEXT_PUBLIC_VERIFICATION_CANISTER_ID);
console.log('STORAGE_CANISTER_ID:', process.env.NEXT_PUBLIC_STORAGE_CANISTER_ID);
console.log('INTERNET_IDENTITY_CANISTER_ID:', process.env.NEXT_PUBLIC_INTERNET_IDENTITY_CANISTER_ID);

// Check if declarations exist
const fs = require('fs');
const path = require('path');

console.log('\n📁 Generated Declarations:');
const declarationsPath = path.join(__dirname, '..', 'src', 'declarations');

const canisters = ['user_management', 'credential_nft', 'verification', 'storage', 'internet_identity'];

canisters.forEach(canister => {
  const canisterPath = path.join(declarationsPath, canister);
  const exists = fs.existsSync(canisterPath);
  console.log(`${canister}: ${exists ? '✅ Found' : '❌ Missing'}`);
  
  if (exists) {
    const files = fs.readdirSync(canisterPath);
    console.log(`  Files: ${files.join(', ')}`);
  }
});

console.log('\n🎉 Verification Complete!');
