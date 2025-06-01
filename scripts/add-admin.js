#!/usr/bin/env node

/**
 * Script to add admin principal to the user management canister
 * Run this script to make your dfx identity an admin
 */

const { execSync } = require('child_process');

// Your dfx principal ID
const ADMIN_PRINCIPAL = 'g5pqo-7ihb2-4vqek-pou4f-pauhm-tfylr-qcvnb-f5fnp-lfjs5-i7xtv-pae';

// Get canister ID from .env.local
const fs = require('fs');
const path = require('path');

function getCanisterId() {
  const envPath = path.join(__dirname, '../.env.local');
  if (!fs.existsSync(envPath)) {
    console.error('❌ .env.local file not found');
    process.exit(1);
  }
  
  const envContent = fs.readFileSync(envPath, 'utf8');
  const match = envContent.match(/NEXT_PUBLIC_USER_MANAGEMENT_CANISTER_ID="([^"]+)"/);
  
  if (!match) {
    console.error('❌ USER_MANAGEMENT_CANISTER_ID not found in .env.local');
    process.exit(1);
  }
  
  return match[1];
}

async function addAdmin() {
  try {
    const canisterId = getCanisterId();
    console.log(`🔧 Adding admin principal: ${ADMIN_PRINCIPAL}`);
    console.log(`📦 Canister ID: ${canisterId}`);
    
    // Check if already admin
    console.log('\n🔍 Checking current admin status...');
    try {
      const checkResult = execSync(
        `dfx canister call ${canisterId} isAdminPrincipal '(principal "${ADMIN_PRINCIPAL}")'`,
        { encoding: 'utf8', stdio: 'pipe' }
      );
      
      if (checkResult.includes('true')) {
        console.log('✅ Principal is already an admin!');
        return;
      }
    } catch (error) {
      console.log('⚠️  Could not check admin status, proceeding with add...');
    }
    
    // Add as admin
    console.log('\n➕ Adding as admin...');
    const result = execSync(
      `dfx canister call ${canisterId} addAdmin '(principal "${ADMIN_PRINCIPAL}")'`,
      { encoding: 'utf8', stdio: 'pipe' }
    );
    
    console.log('✅ Successfully added admin!');
    console.log('📋 Result:', result.trim());
    
    // Verify
    console.log('\n🔍 Verifying admin status...');
    const verifyResult = execSync(
      `dfx canister call ${canisterId} isAdminPrincipal '(principal "${ADMIN_PRINCIPAL}")'`,
      { encoding: 'utf8', stdio: 'pipe' }
    );
    
    if (verifyResult.includes('true')) {
      console.log('✅ Admin verification successful!');
      console.log('\n🎉 You can now access the admin dashboard at: http://localhost:3001/admin');
    } else {
      console.log('❌ Admin verification failed');
    }
    
  } catch (error) {
    console.error('❌ Error adding admin:', error.message);
    console.log('\n💡 Make sure:');
    console.log('   1. DFX is running (dfx start)');
    console.log('   2. Canisters are deployed (dfx deploy)');
    console.log('   3. You are in the correct directory');
    process.exit(1);
  }
}

// Run the script
addAdmin();
